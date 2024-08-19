from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from user.models import AppUser

class OnlineStatusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user")
        self.group_name = "online-status"

        await self.accept()

        if self.user is None or not self.user or not self.user.is_authenticated:
            await self.send_error(401, "User is not authenticated.")
            await self.close()
            return

        try:
            await self.channel_layer.group_add(self.group_name, self.channel_name)

            await self.add_user_to_online_list(self.user)
            await self.send_online_users_list()
        except Exception as e:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.send_error(500, f"Failed to connect: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.remove_user_from_online_list(self.user)
            try:
                await self.channel_layer.group_discard(self.group_name, self.channel_name)
                await self.send_online_users_list()
            except Exception as e:
                await self.send_error(500, f"Failed to discard user from group: {str(e)}")

    async def send_online_users_list(self):
        try:
            online_users = await self.get_online_users()
            event = {
                "type": "update_online_users_list",
                "online_users": online_users,
            }
            await self.channel_layer.group_send(self.group_name, event)
        except Exception as e:
            await self.send_error(500, f"Failed to send online users list: {str(e)}")

    async def update_online_users_list(self, event):
        try:
            await self.send_json({"online_users": event["online_users"]})
        except Exception as e:
            await self.send_error(500, f"Failed to update online users list: {str(e)}")

    @database_sync_to_async
    def add_user_to_online_list(self, user):
        if user.is_authenticated:
            user.is_online = True
            user.save()

    @database_sync_to_async
    def remove_user_from_online_list(self, user):
        if user.is_authenticated:
            user.is_online = False
            user.save()

    @database_sync_to_async
    def get_online_users(self):
        return list(
            AppUser.objects.filter(is_online=True).values_list("username", flat=True)
        )

    async def send_error(self, code, message):
        await self.send_json(
            {
                "error": True,
                "errorCode": code,
                "errorMessage": message,
            }
        )
