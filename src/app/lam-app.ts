import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import type { LamPlayerFormSubmitEvent } from "#src/components/lam-player-form.ts";
import "#src/components/lam-player-form.ts";

@customElement("lam-app")
export class LamApp extends LitElement {
	private handleStartGame(event: LamPlayerFormSubmitEvent) {
		const { playerName } = event.detail;
		alert(`Starting game for player: ${playerName}`);
	}
	render() {
		return html`
			<lam-player-form
				@lam-player-form-submit=${this.handleStartGame}
				min-length="3"
				max-length="10"
			></lam-player-form>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lam-app": LamApp;
	}
}
