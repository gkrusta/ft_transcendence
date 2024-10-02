import { Component } from "../../scripts/Component.js";
import { navigateTo } from '../../scripts/Router.js';
import { languageSelector } from '../../components/LanguageSelector/languageSelector.js';
import customAlert from '../../scripts/utils/customAlert.js';
import { tournamentSocket } from '../../scripts/utils/TournamentWebsocket.js';

export class Tournament extends Component {
	constructor() {
		super('/pages/Tournament/tournament.html');
	}

	destroy() {
		console.log('Tournament custom destroy');

		this.removeAllEventListeners();
	}

	init() {
	}


	closeTournament() {

	}

	exitTournament() {

	}

	static renderButtons(creatorId, currentId) {
		const container = document.getElementById('root_tournament_container');

		if (container) {
			const btnContainer = container.querySelector('#root_tournament_btn_container');

			if (btnContainer) {
				if (creatorId === currentId) {
					btnContainer.innerHTML = `Close <br> Delete`
				} else {
					btnContainer.innerHTML = `Exit`
				}
			} else {
				console.warn('root_tournament_btn_container is not found.');
			}
		} else {
			console.warn('root_tournament_container is not found.');
		}
	}

	static renderPlayers(players) {
		const topHalf = document.querySelector('.top-half');
		const bottomHalf = document.querySelector('.bottom-half');

		const totalPlayers = 8;

		const defaultAvatar = '/assets/images/default_avatar.jpg';
		const defaultNickname = 'IA';

		const fullPlayerList = [...players];

		while (fullPlayerList.length < totalPlayers) {
			fullPlayerList.push({
				nickname: defaultNickname,
				avatar: defaultAvatar
			});
		}

		if (topHalf && bottomHalf) {
			topHalf.innerHTML = '';
			bottomHalf.innerHTML = '';

			for (let i = 0; i < 4; i += 2) {
				const matchContainerHtml = `
					<div class="match-container col d-flex justify-content-center align-items-end ml-0">
						${createPlayerHtml(fullPlayerList[i], i + 1)}
						${createPlayerHtml(fullPlayerList[i + 1], i + 2)}
					</div>
				`;
				topHalf.insertAdjacentHTML('beforeend', matchContainerHtml);
			}

			for (let i = 4; i < 8; i += 2) {
				const matchContainerHtml = `
					<div class="match-container col d-flex justify-content-center align-items-end ml-0">
						${createPlayerHtml(fullPlayerList[i], i + 1)}
						${createPlayerHtml(fullPlayerList[i + 1], i + 2)}
					</div>
				`;
				bottomHalf.insertAdjacentHTML('beforeend', matchContainerHtml);
			}
		}

		function createPlayerHtml(player, index) {
			return `
				<div id="player${index}" class="player-container row d-flex col-6 h-60 justify-content-center">
					<div class="col-10 col-sm-6">
						<div class="d-flex justify-content-center">
							<div class="avatar rounded-circle">
								<img id="avatar-${index}" class="rounded-circle h-100 square" src="${player.avatar}" alt="">
							</div>
						</div>
						<div class="nickname-placeholder col-12 m-0 d-flex justify-content-center row mt-1">
							<span id="nickname-${index}" class="nickname bg-light rounded-2 text-center py-1">${player.user_name}</span>
						</div>
					</div>
				</div>
			`;
		}
	}

}
