// Comprobación mínima de la regla D9: `node scripts/check-huella.ts`
import assert from "node:assert/strict";
import { huellaDe, huellasComparables } from "../src/lib/origen.ts";

assert.deepEqual(huellaDe("2.1 t CO2e/t"), { kg: 2100, por: "t" });
assert.deepEqual(huellaDe("820 kg CO2e/t"), { kg: 820, por: "t" });
assert.equal(huellaDe("−180 kg CO2e/m³ (neto)"), null); // signo y aclaración: no se compara
assert.equal(huellaDe(42), null); // número suelto: no dice por qué unidad
assert.deepEqual(huellasComparables("820 kg CO2e/t", "0.42 t CO2e/t"), { a: 820, b: 420, por: "t" });
assert.equal(huellasComparables("1.4 kg CO2e/pieza", "12 kg CO2e/m² muro"), null);
console.log("huella: ok");
