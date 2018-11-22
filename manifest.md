Learning Lisp
================================================================================



+ [Manifest](#manifest)
+ [S-Expressions](#s-expressions)
+ [Data-Types](#data-types)
+ [Notable Features](#notable-features)
+ [Iteration and/or Recursion](#iteration-andor-recursion)
+ [Denotational Semantics of Language Constructs](#denotational-semantics-of-language-constructs)
+ [The Reader](#the-reader)


## Manifest
--------------------------------------------------------------------------------

  + [ ] Create classes for types.



## S-Expressions
--------------------------------------------------------------------------------

S-expressions are fundamental to lisp-like languages.

An s-expression for the purpose of this project can be defined as:

  + An atom.
  + An expression of the form `(a b ...)` where `a` and `b` are s-expressions.



## Data-Types
--------------------------------------------------------------------------------

Following the tradition of lisp, monalisp is homoiconic, i.e monalisp is
represented as monalisp data structures.

Data-types vary dramatically across lisp dialects. Because monalisp will be
based on JavaScript I will be using JavaScript datatypes and structures, which
are: 

  + Undefined | Null | Nil
  + Boolean
  + Number
  + String
  + Symbol
  + List
  + Object
  + Function | Lambda



## Notable Features
--------------------------------------------------------------------------------

I would prefer that the feature-set be as minimal as possible. If a relevant
feature is definable in terms of another(s) that would be preferable. 

**Strong Support**

  + Named & Anonymous First Class Functions
  + Generators
  + List Literals
  + Object Literals
  + Immutability
  + Auto-Curried Functions
  + Lexical | Closure Scoping
  + Tail Recursion | Loop Constructs
  + Short Circuit Logical Operators
  + Conditional Branching

**Potential Support**

  + Namespaces
  + Optional Static Typing
  + Spread Operator



## Iteration and/or Recursion
--------------------------------------------------------------------------------

I am currently unsure exactly what constructs should be used for iteration and
recursion. Perhaps for more imperative of traditional style, a while construct,
such as what follows could be created.

    (def x 10) ==> 10

so...

    (for i (range 0 10), j (range 10 20)
      (...))

In the preceeding snippet, `for` would need to be a macro, as `i` and `j` in
this context should not be evaluated.



## Denotational Semantics of Language Constructs
--------------------------------------------------------------------------------

Definition of language construct semantics. This will definitely be an
interesting exercise, as some features may not be easily expressed in terms of
denotational semantic's meanings. Starting with those features that are closely
aligned with the model of semantics.

Wait, in Conal Elliot's paper on denotational semantics, operations were defined
in terms of the meaning of its operational type, these features appear to be,
for the most part, independent.

    if :: Boolean -> α -> β -> (α || β)
    μ(if bool t f) = IF (bool = true) THEN (t) ELSE (f)
    
    quote(') :: SExpr -> SExpr
    μ(' expr) = expr

    assign :: Symbol -> α -> α
    μ(assign sym val) 

    curry :: ((α β ...τ) -> ρ) -> (α -> β -> ...τ -> ρ)
    μ(curry fn)

Ya this exercise has definitely been difficult, the power of denotational
semantics that I was able to draw in previous attempts - or at least what I
believe is the power - was defining each operation in terms of a family's type
meaning. Because each operation's meaning was defined with a mutual model, they
became much more composable and interopable, and, perhaps an even greater
benefit, relationships between operations became much clearer.

I may have gone about semantic definition obtusely; lisp semantics are based, in
its entirety, on S-Expressions. The above attempts at defining individual
operation semantics may be reformed as operations of the type `s-expr`.

Before continuing, the feature-set should be separated into operations and
characteristics.


**Types**

  + [x] Undefined | Null | Nil
  + [x] Boolean
  + [x] Number
  + [x] String
  + [x] Symbol
  + [x] Key
  + [ ] List
  + [ ] Object
  + [ ] Function | Lambda
  + [ ] S-Expression

**Operations**

  + [ ] Conditional Branching
    + Should be short-circuiting
  + [ ] Named & Anonymous, First Class Functions
  + [ ] Tail Recursion | Loop Constructs
  + [ ] Generators
  + [ ] Short Circuit Logical Operators
  + [ ] Macro = S-Expression Operation?

**Symbol Legend**

  + expr :: S-Expression.
  + \* :: Signifies zero or more trailing values of its preceeding type.
  + CAPS :: Imaginary control flow statements.
  + | :: Sum type operator.
  + => :: Meaning of.


**Semantics**

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ hs


(key) => key


(symbol) => symbol


(nil) => nil

    is-nil :: expr -> bool
    μ(is-nil x) => (= x nil)


(bool) => true | false

    bang(!) :: bool -> bool
    μ(bang bool) => (= bool false)

    if :: bool -> α -> β -> α | β
    μ(if test t f) => IF test THEN t ELSE f


(number: group) => number

    empty :: number
    μ(empty) => 0

    concat :: number -> number -> number
    μ(add x y *) => x + y *

    invert :: number -> number
    μ(invert n) => -n

    inc :: number -> number
    μ(inc n) => (+ n 1)

    dec :: number -> number
    μ(dec n) => (- n 1)


(string: monoid) => "*"

  empty :: string
  μ(empty) => ""

  concat :: string -> string -> string
  μ(concat a b *) => "ab*"


(ls: monoid functor) => (*)

    empty :: ls
    μ(empty) => ()

    concat :: ls -> ls -> ls
    μ(concat a b) => (*a *b)

    map :: (α -> β) -> ls -> ls
    μ(map fn l) => (concat (ls (fn (head l)) (map (rest l))))


(expr) => atom | (expr expr)

    empty :: expr
    μ(empty) => ()

    concat :: expr -> expr -> expr
    μ(concat a b) => (a b)

    eq :: expr -> expr -> bool
    μ(eq a b) => a EQ b

    and :: expr * -> expr
    μ(and a b *) => (if a (and b *) a)

    or :: expr * -> expr
    μ(or a b *) => (if a a (or b *))


(map) => λ.k -> v

    assoc :: map -> key -> expr -> map
    μ(assoc m k v) => λ.k' -> (if (= k k') v m[k'])

    dissoc :: map -> key -> map
    μ(dissoc m k) => λ.k' -> (if (= k k') nil m[k'])


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



**Inquiries**

  + Are S-Expressions and Lists destinguishable data types?



## The Reader
--------------------------------------------------------------------------------

Each type within the language is represented as a data class:

  + Undefined | Null | Nil
  + Boolean
  + Number
  + String
  + Symbol
  + Key
  + List | S-Expression
  + Object
  + Function | Lambda

Each has a static property `type` corresponding to its constrcutor name, and an
instance property `value`, which is the JavaScript representation of its value.
Other nodes may have additional properties specific to its type.

One question I currently have is, typically the source code of a lisp language
is represented in terms of its own list data structure. However, the use case I
desire, including whitespace nodes is logical; when modifying source maintaining
the whitespace is important, receiving a one line blob would be cumbersome on
each source update.

For macros however, whitespace nodes would obviously not be included.

    [Symbol('+'), Number(10), Number(5)]
      -vs-
    [Symbol('+'), WhiteSpace(' '), Number(10)...]

What could be done, is that macros could receive a view of the same data
structure, filtering all whitespace nodes, whitespace nodes could then be
included or not for Mutation-Hooks.

When evaluating the resulting AST, WhiteSpace nodes could be skipped, perform a
noop action, or could be filtered before being sent for Evaluation.

Perhaps there can be an Abstract Syntax Tree, and an Expression Tree.

I'm having difficulty conceptualizing the reader. Perhaps a good first step
would be simply to parse source into a list of strings. So that:

    (alpha beta gamma delta) => ["alpha", "beta", "gamma", "delta"]

In order to gain a slightly better understanding of the parser's control flow.

Then the Finite State Machine would be simpler:

        (Read) - [if '('] - (List)
          |   \_____
        [if [a-z]]  \
          |        [if \s]
        (Symbol)      \
                    (Whitespace)

Alright I just wrote some of the ugliest code ever, I've got to try a different
approach.

Alright, I will try another attempt at parsing a list of strings, trying out the
use of some helper functions.
