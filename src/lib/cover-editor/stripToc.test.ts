import { test, expect } from "bun:test";
import { stripTableOfContents } from "./myBooks";
test("retire la table des matières", () => {
  const r = stripTableOfContents("Un mariage sicilien tourne au règlement de comptes.\n\nTABLE DES MATIÈRES VALIDÉE\nChapitre 1 : Le départ\nChapitre 2 : La fête");
  expect(r).toBe("Un mariage sicilien tourne au règlement de comptes.");
});
test("retire les listes de chapitres", () => {
  expect(stripTableOfContents("Guide. En 3 chapitres, le livre aborde : A, B, C. Une méthode simple.")).toBe("Guide. Une méthode simple.");
});
