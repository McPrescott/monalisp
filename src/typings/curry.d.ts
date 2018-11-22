export interface Curry {
  <α extends any[], ρ>(func: (...args: α) => ρ): {
    1: CurriedOne<α[0], ρ>;
    2: CurriedTwo<α[0], α[1], ρ>;
    3: CurriedThree<α[0], α[1], α[2], ρ>;
    4: CurriedFour<α[0], α[1], α[2], α[3], ρ>;
    5: CurriedFive<α[0], α[1], α[2], α[3], α[4], ρ>;
    6: CurriedSix<α[0], α[1], α[2], α[3], α[4], α[5], ρ>;
    7: (...args: any[]) => any;
  }[α extends [any]? 1
  : α extends [any, any]? 2
  : α extends [any, any, any]? 3
  : α extends [any, any, any, any]? 4
  : α extends [any, any, any, any, any]? 5
  : α extends [any, any, any, any, any, any]? 6 : 7];
}

interface CurriedOne<α, ρ> {
  (arg: α): ρ;
}

interface CurriedTwo<α, β, ρ> {
  (arg: α): CurriedOne<β, ρ>;
  (...args: [α, β]): ρ;
}

interface CurriedThree<α, β, γ, ρ> {
  (arg: α): CurriedTwo<β, γ, ρ>;
  (...args: [α, β]): CurriedOne<γ, ρ>;
  (...args: [α, β, γ]): ρ;
}

interface CurriedFour<α, β, γ, δ, ρ> {
  (arg: α): CurriedThree<β, γ, δ, ρ>;
  (...args: [α, β]): CurriedTwo<γ, δ, ρ>;
  (...args: [α, β, γ]): CurriedOne<δ, ρ>;
  (...args: [α, β, γ, δ]): ρ;
}

interface CurriedFive<α, β, γ, δ, ε, ρ> {
  (arg: α): CurriedFour<β, γ, δ, ε, ρ>;
  (...args: [α, β]): CurriedThree<γ, δ, ε, ρ>;
  (...args: [α, β, γ]): CurriedTwo<δ, ε, ρ>;
  (...args: [α, β, γ, δ]): CurriedOne<ε, ρ>;
  (...args: [α, β, γ, δ, ε]): ρ;
}

interface CurriedSix<α, β, γ, δ, ε, ζ, ρ> {
  (arg: α): CurriedFive<β, γ, δ, ε, ζ, ρ>;
  (...args: [α, β]): CurriedFour<γ, δ, ε, ζ, ρ>;
  (...args: [α, β, γ]): CurriedThree<δ, ε, ζ, ρ>;
  (...args: [α, β, γ, δ]): CurriedTwo<ε, ζ, ρ>;
  (...args: [α, β, γ, δ, ε]): CurriedOne<ζ, ρ>;
  (...args: [α, β, γ, δ, ε, ζ]): ρ;
}