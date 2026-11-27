import { html } from "lit";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-lit";
import "#src/components/lam-player-form.ts";

const renderForm = () =>
	render(
		html`<lam-player-form min-length="3" max-length="10"></lam-player-form>`,
	);

describe("lam-player-form", () => {
	it("disables the start button until the name is valid", async () => {
		const screen = renderForm();
		const button = screen.getByRole("button", { name: "START" });

		await expect.element(button).toBeDisabled();

		await userEvent.type(screen.getByPlaceholder("Name"), "Dani");

		await expect.element(button).toBeEnabled();
	});

	it("shows a hint while the name is too short", async () => {
		const screen = renderForm();
		const hint = screen.getByText(/Please enter a valid name/);

		await expect.element(hint).toBeVisible();

		await userEvent.type(screen.getByPlaceholder("Name"), "Dani");

		await expect.element(hint).not.toBeInTheDocument();
	});

	it("ignores surrounding whitespace when validating", async () => {
		const screen = renderForm();

		await userEvent.type(screen.getByPlaceholder("Name"), "  ab  ");

		await expect
			.element(screen.getByRole("button", { name: "START" }))
			.toBeDisabled();
	});

	it("dispatches the trimmed name on submit", async () => {
		const screen = renderForm();
		const onSubmit = vi.fn();
		screen.container.addEventListener("lam-player-form-submit", onSubmit);

		await userEvent.type(screen.getByPlaceholder("Name"), "  Dani  ");
		await userEvent.click(screen.getByRole("button", { name: "START" }));

		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onSubmit.mock.calls[0]?.[0].detail).toEqual({ playerName: "Dani" });
	});
});
