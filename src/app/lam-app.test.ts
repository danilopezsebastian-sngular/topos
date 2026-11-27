import { html } from "lit";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-lit";
import "#src/app/lam-app.ts";

describe("lam-app", () => {
	it("renders the player form", async () => {
		const screen = render(html`<lam-app></lam-app>`);

		await expect
			.element(screen.getByRole("button", { name: "START" }))
			.toBeInTheDocument();
	});
});
