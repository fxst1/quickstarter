export type CliOptionType = 'string' | 'number' | 'boolean';

export interface CliOptionDescription<T = unknown> {
    // Identification
    name: string;                        // Nom interne
    short?: string;                      // ex: "v"
    long?: string;                       // ex: "verbose"
    description?: string;

    // Typage
    type?: CliOptionType;                // Par défaut: boolean
    default?: T;
    choices?: readonly T[];

    // Contraintes spécifiques
    min?: number;
    max?: number;
    regex?: RegExp;                      // ✅ validation de string via regex
    accumulate?: (prev: T) => T;

    // Personnalisation
    parse?: (input: string | true) => T;
}
