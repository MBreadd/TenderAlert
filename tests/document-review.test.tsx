import { render, screen, act, fireEvent } from "@testing-library/react";
import { DocumentReview } from "../components/dashboard/DocumentReview";

describe("DocumentReview", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("simulates upload, shows analyzing, then displays hardcoded results", () => {
    render(<DocumentReview />);

    const uploadArea = screen.getByText(/Subir Documentos de Sustento/i);
    fireEvent.click(uploadArea);

    expect(screen.getByText(/Analizando documentos con IA/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/Certificado RNP detectado/i)).toBeInTheDocument();
    expect(screen.getByText(/Falta Anexo 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Documento de Experiencia Técnica no encontrado/i)).toBeInTheDocument();
  });
});
