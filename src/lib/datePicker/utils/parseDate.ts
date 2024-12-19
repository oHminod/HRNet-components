// parrseDate.ts
export const parseDateFromInput = (rawInput: string): string => {
    const digits = rawInput.replace(/\D/g, "");
    let day = "";
    let month = "";
    let year = "";
    let index = 0;

    // Parsing du jour
    if (digits.length > 0) {
        const d1 = digits.charAt(0);
        if (["0", "1", "2"].includes(d1)) {
            // On peut essayer de prendre un deuxième chiffre pour le jour
            if (digits.length > 1) {
                const d2 = digits.charAt(1);
                const dayNum = parseInt(d1 + d2, 10);
                if (dayNum >= 1 && dayNum <= 31) {
                    day = d1 + d2;
                    index = 2;
                } else {
                    // Le deuxième chiffre ne permet pas un jour valide
                    // On garde uniquement le premier chiffre comme jour partiel
                    day = d1;
                    index = 1;
                }
            } else {
                // Un seul chiffre pour le moment
                day = d1;
                index = 1;
            }
        } else if (d1 === "3") {
            // Le jour peut être 30 ou 31
            if (digits.length > 1) {
                const d2 = digits.charAt(1);
                if (d2 === "0" || d2 === "1") {
                    // Jour valide 30 ou 31
                    day = "3" + d2;
                    index = 2;
                } else {
                    // Deuxième chiffre non valide pour un jour commençant par 3
                    // On considère alors le jour = 03 et le d2 sera pour le mois
                    day = "03";
                    // On ne consomme pas le d2 ici, il servira pour le mois
                    index = 1;
                }
            } else {
                // Seulement un '3' tapé, on attend de voir si un autre chiffre vient
                day = "3";
                index = 1;
            }
        } else {
            // Premier chiffre du jour > 3, ex: '5'
            // On considère jour = 0 + ce chiffre, ex: 05
            // et on passe au mois directement après
            day = "0" + d1;
            index = 1;
        }
    }

    // Parsing du mois
    if (digits.length > index) {
        const m1 = digits.charAt(index);
        if (m1 === "0") {
            // Mois entre 01 et 09
            if (digits.length > index + 1) {
                const m2 = digits.charAt(index + 1);
                const monthNum = parseInt(m1 + m2, 10);
                if (monthNum >= 1 && monthNum <= 9) {
                    month = m1 + m2;
                    index += 2;
                } else {
                    // Mois invalide à deux chiffres, on garde juste '0' comme préfixe
                    month = m1;
                    index += 1;
                }
            } else {
                // Un seul chiffre dispo pour le mois pour l'instant
                month = m1;
                index += 1;
            }
        } else if (m1 === "1") {
            // Mois entre 10 et 12
            if (digits.length > index + 1) {
                const m2 = digits.charAt(index + 1);
                const monthNum = parseInt(m1 + m2, 10);
                if (monthNum >= 10 && monthNum <= 12) {
                    month = m1 + m2;
                    index += 2;
                } else {
                    // On garde juste '1' comme mois partiel
                    month = m1;
                    index += 1;
                }
            } else {
                month = m1;
                index += 1;
            }
        } else {
            // m1 > 1 (ex: 4 => mois invalide)
            // On considère mois = '0'+m1, et le reste ira dans l'année
            month = "0" + m1;
            index += 1;
        }
    }

    // Parsing de l'année
    if (digits.length > index) {
        year = digits.slice(index);
    }

    // Construction finale du format JJ/MM/AAAA
    let formattedInput = day;
    if (month) {
        formattedInput += "/" + month;
    }
    if (year) {
        formattedInput += "/" + year;
    }

    return formattedInput;
};
