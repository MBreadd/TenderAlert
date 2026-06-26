import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OnboardingPage from "../app/onboarding/page";

// ponytail: mock useRouter since we don't need full Next.js context
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("OnboardingPage", () => {
  it("enables 'Confirmar y Continuar' button only after checking privacy", async () => {
    render(<OnboardingPage />);
    const user = userEvent.setup();

    const button = screen.getByRole("button", { name: /Confirmar y Continuar/i });
    expect(button).toBeDisabled();

    const checkbox = screen.getByLabelText(/Acepto el tratamiento de mis datos personales/i);
    await user.click(checkbox);

    expect(button).toBeEnabled();
  });
});
