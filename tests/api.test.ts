import { POST } from "../app/api/match/route";
import { mockEmpresa } from "../lib/mocks";

// ponytail: tested Next.js route handler directly without standing up a server
describe("POST /api/match", () => {
  it("returns 200 with compatible opportunities for valid input", async () => {
    const req = new Request("http://localhost/api/match", {
      method: "POST",
      body: JSON.stringify({ empresa: mockEmpresa }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("returns 400 when empresa profile is missing", async () => {
    const req = new Request("http://localhost/api/match", {
      method: "POST",
      body: JSON.stringify({ empresa: {} }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("Falta el perfil de empresa");
  });
});
