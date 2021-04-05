# Tic-Tac-Toe
Tic-Tac-Toe Project taken from The Odin Project. See Demo [Here](https://newcastile.github.io/Tic-Tac-Toe/)

## Factory Functions
*"JavaScript provides a much richer set of code reuse patterns. It can ape the classical pattern, but it also 
supports other patterns that are more expressive. The set of possible inheritance patterns in JavaScript is vast."*

Something that i copy and pasted from Douglas Crockford's JavaScript The Good Parts that does 
a little introduction to the topic referenced in the title because the factory pattern is just another 
way for creating objects in JavaScript. They're just functions that return objects when they're called. 
The factory pattern takes advantages of closures in order to simulate privacy, wich cannot be achieved 
with differential inheritance. 

So inside a function we can create variables and other functions and then return and object whose properties and 
methods will be the variables and functions defined in the body of the first function that we want to export, so the variables
and functions that were not returned will be private data and the returned will be accesible from outside the function,
thus creating objects with private and public properties.

In this project i used cloning for creating the players, knowing this after reading [Eric Elliott's article](https://medium.com/javascript-scene/3-different-kinds-of-prototypal-inheritance-es6-edition-32d777fa16c9).

## Modular JavaScript
The best part of this project was to learn and apply the essential concepts of modular javascript.
Scope and closures, private and public scope, modules and dependencies, structure design, Immediately Invoked Function Expressions, 
the revealing module pattern and the PubSub Module. A source that really helped was LearnCode.academy Modular Javascript series.

## PubSub Pattern
Also seen in the LearnCode.academy Modular Javascript series, in the project this module helps update the game counter element and
to display the winner of the match or if there was a draw. For a better understanding of this pattern Addy Osmani's Learning JavaScript
Dessign Patterns and Stoyan Stefanov's JavaScript Pattern were very good resources. In Pages 171 to 172 of JavaScript Patterns are explained
the 4 componentes of the pattern: The subcribers array and the subscribe, unsubscribe and publish methods.
