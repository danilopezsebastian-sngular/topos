import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("lam-app")
export class LamApp extends LitElement {
	render() {
		return html` <div>Lit-a-mole</div> `;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lam-app": LamApp;
	}
}
