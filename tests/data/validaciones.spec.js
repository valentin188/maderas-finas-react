import { correoValido, telefonoValido, runValido } from '../../src/data/validaciones.js';

describe('Validaciones', () => {
  it('acepta correos permitidos y rechaza otros dominios', () => {
    expect(correoValido('persona@duoc.cl')).toBe(true);
    expect(correoValido('persona@example.com')).toBe(false);
  });

  it('valida teléfonos chilenos y RUN', () => {
    expect(telefonoValido('+56912345678')).toBe(true);
    expect(telefonoValido('123')).toBe(false);
    expect(runValido('111111111')).toBe(true);
    expect(runValido('111111112')).toBe(false);
  });
});
