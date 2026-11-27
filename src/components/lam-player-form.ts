import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export type LamPlayerFormSubmitEvent = CustomEvent<{ playerName: string }>;

@customElement("lam-player-form")
export class LamPlayerForm extends LitElement {
	static styles = css`
		:host {
			display: block;
		}
		input {
			background-color: var(--background-color, #f5f5f5);
			border: 1px solid var(--primary-color, #6200ee);
			padding: 0.5rem;
		}
		#submit {
			background-color: var(--primary-color, #6200ee);
			color: white;
			border: none;
			padding: 0.5rem 1rem;
			cursor: pointer;
		}
		#submit:disabled {
			background-color: var(--secondary-color, #03dac6);
			cursor: not-allowed;
		}
	`;

	@state()
	private trimmedName = "";

	@property({ type: Number, attribute: "min-length" })
	minLength = 3;

	@property({ type: Number, attribute: "max-length" })
	maxLength = 10;

	private handleInputChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		this.trimmedName = input.value.trim();
	}

	private validateName() {
		const trimmedName = this.trimmedName;
		if (
			trimmedName.length < this.minLength ||
			trimmedName.length > this.maxLength
		) {
			return false;
		}
		return true;
	}

	private handleSubmit(event: Event) {
		event.preventDefault();
		const customEvent = new CustomEvent("lam-player-form-submit", {
			detail: { playerName: this.trimmedName },
			bubbles: true,
			composed: true,
		});
		this.dispatchEvent(customEvent);
	}

	render() {
		return html`
			<form @submit=${this.handleSubmit}>
				<input
					type="text"
					name="name"
					placeholder="Name"
					maxlength=${this.maxLength}
					@input=${this.handleInputChange}
				/>
				<button id="submit" type="submit" ?disabled=${!this.validateName()}>
					START
				</button>
			</form>
			${
				!this.validateName()
					? html`<p>
							Please enter a valid name between ${this.minLength} and
							${this.maxLength} characters.
						</p>`
					: nothing
			}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"lam-player-form": LamPlayerForm;
	}
	interface HTMLElementEventMap {
		"lam-player-form-submit": LamPlayerFormSubmitEvent;
	}
}
