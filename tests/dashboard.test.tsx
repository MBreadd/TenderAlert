import { render, screen } from "@testing-library/react";
import { OportunidadCard } from "../components/dashboard/OportunidadCard";
import { mockOportunidades } from "../lib/mocks";

describe("OportunidadCard Paywall", () => {
  const op = mockOportunidades[0];

  it("shows full content when unlocked (index 0)", () => {
    render(<OportunidadCard oportunidad={op} index={0} />);
    expect(screen.queryByText(/Actualiza a Pro para desbloquear/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver análisis completo/i })).toBeInTheDocument();
  });

  it("shows lock overlay and disables content when locked (index > 0)", () => {
    render(<OportunidadCard oportunidad={op} index={1} />);
    expect(screen.getByText(/Actualiza a Pro para desbloquear/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Desbloquear con Pro/i })).toBeInTheDocument();
  });
});
