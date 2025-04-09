---
title: Neural Networks 1 - Definition and Perceptrons
author: neplod
altImage: Image of neurons in the form of a network.
description: Introduction to the world of neural networks and artificial intelligence. Overview of neural networks and perceptrons.
date: 2025-02-17
tags: 
    - Neural Networks
---

# Neural Networks  
## What Are They?

A **neural network** is a computer program that tries to mimic how the human brain learns in order to solve very complex problems or algorithms that a regular programmer would take a long time to code manually. In other words, it’s a program that rewrites itself very quickly to solve complex problems.

It’s not really a traditional computer program like a Python or JavaScript _script_, but rather a network of many **parameters**, like radio dials. These receive an input, perform a series of operations using those parameters—sometimes running special algorithms in between—and finally give a **prediction**.

Neural networks go through a **training phase**, during which those parameters can be changed. This allows them to learn from their mistakes and try to give more accurate answers. The goal of this phase is to reduce the **error rate** as much as possible, ideally down to around 0.01%, since reaching a total 0% is extremely difficult.

## History

Neural networks were invented in the **1940s** by **Warren McCulloch** and **Walter Pitts**, who proposed the first mathematical model of an artificial neuron.

Later, in **1958**, **Frank Rosenblatt** created the **Perceptron**, one of the first neural networks capable of learning, although not by itself due to the technological limitations of the 1960s and 70s. As a result, interest in neural networks declined sharply.

The real boom came in the **1980s and 90s**, when the first automatic training algorithms were developed. This made it possible to create more complex networks. From there, not much progress was made until **2010**, when the power of GPUs (Graphics Processing Units) and the abundance of data led to the rise of **deep learning** and applications like facial recognition, the first **virtual assistants**, and later, **advanced language models**.

## Uses

Neural networks have far more uses than most people think. Aside from AIs like **ChatGPT** or **Gemini**, they’re used in video recommendation algorithms, smart search engines, translation tools, driver assistance systems, automatic subtitles, recent scientific discoveries...

In short, neural networks are now a fundamental part of **technology** and **innovation** due to how **easily they can be trained** for nearly any kind of problem, and they will continue to drive rapid advances in **technology** and **science**.

# The Perceptron

The first neural network ever built into a physical machine was the **perceptron**, a device with input **switches**, some **dials** to perform calculations, and an output display that showed the result.

This machine wasn’t built like today’s computers, so it didn’t calculate using 0s and 1s, but instead used negative and positive currents for inputs and dials, and an ammeter to show the output.

This is the simplest kind of neural network: just two layers—one input and one output—with nothing in between, which makes it very easy to understand.

Let’s start by defining the number of inputs. In this case, we’ll use just **2** inputs. The number of outputs is always 1. So our perceptron would have 2 switches, 3 dials, and 1 ammeter.

First, the switches. They only have two states: **on** and **off**, so you might think we could define "on" as 1 and "off" as 0. But because of how the perceptron works, off can't be 0, so we use -1 instead. We'll label each switch with a number and an 'e' to make calculations easier: ‘e₁’ and ‘e₂’. Since these are inputs, they’re changed by the user to calculate the output.

Next, the dials. You might wonder why we have 3 instead of 2, but there’s a reason. These dials represent values between a negative and a positive number—for example, -2 and 2. These values are called **weights** because they add weight or value to the input. There’s also an extra value called **BIAS**, which is used to fine-tune the output. We’ll label the weights with ‘p’ and a number, and the bias with ‘b’: ‘p₁’, ‘p₂’, and ‘b’. Users manually adjust the dials to get the correct output, though once it works, they don’t need to change them—unless they want to reduce the error.

The ammeter is the output. It shows the **amperage** of the resulting current, which can be positive or negative. Usually, if the amperage is positive, the output is 1 or yes; if it’s negative, the output is 0 or no. We'll label this as ‘s’.

Now that we’ve labeled all the components of the perceptron, we can perform the necessary calculations. We know that to calculate ‘s’, we need to do some operations using ‘e₁’, ‘e₂’, ‘p₁’, ‘p₂’, and ‘b’, but we don’t yet know what those operations are. Fortunately, **Warren McCulloch** and **Walter Pitts** figured that out in 1940:

\[
s = \sum_{i=0}^{n} e_i \cdot p_i + b
\]

Okay, that might still look a bit complicated, but it’s the basis of what we’ll use. Let’s simplify it:

\[
s = e₁ \cdot p₁ + … + eₙ \cdot pₙ + b
\]

Now we can clearly see what’s going on. The output is the sum of the inputs multiplied by their corresponding weights, plus the bias. So our specific formula will be:

\[
s = e₁ \cdot p₁ + e₂ \cdot p₂ + b
\]

Now we understand what’s happening inside the perceptron. With this, we can train the perceptron to solve a problem. While this knowledge isn’t strictly necessary for training, it definitely helps.

Let’s give our perceptron a **problem**, like: “I want the output to be positive when **either** input is on, but negative when neither is.” Obviously, the machine doesn’t understand natural language, so we’ll train it ourselves. By adjusting the values, you’ll see that setting both weights and the bias to positive gives the desired result.

Now let’s try a more complex machine—one with a 4x4 grid of switches so we can draw simple shapes. Based on what we know, we can write the formula as:

\[
s = e₁ \cdot p₁ + e₂ \cdot p₂ + … + e₁₆ \cdot p₁₆ + b
\]

The new problem is: “I want the output to be positive when it recognizes **pattern A** (the letter L) and negative when it sees **pattern B** (the letter C).” This is harder because with 16 weights, there are many possible combinations, and randomly changing weights won’t work like before. Luckily, there’s a quick and easy way to train the perceptron:

1. Set all dials to 0.
2. Enter pattern A using the switches.
3. Adjust the weights: increase the weights for **on** switches and decrease for **off** switches. You can also tweak the bias.
4. Enter pattern B using the switches.
5. Adjust the weights: **decrease** for **on** switches and **increase** for **off** switches. Again, tweak the bias if needed.
6. Repeat steps 2–5 until the output is correct.

By following these steps, we can train the perceptron fairly quickly, and it will be able to recognize these **patterns**.

But there’s a problem. To understand it, let’s go back to the 2-input perceptron.

In a 2D plane, we can represent the inputs as 4 points: (1,1), (1,-1), (-1,1), (-1,-1), and the output as a line that separates points with a positive output from those with a negative one. That makes sense because there’s only one layer of weights. So in our previous problem, the best-trained perceptron would have the line between (-1,-1) and (0,0)—in other words, centered at (-0.5,-0.5) and diagonal to the axes. Mathematically:

\[
y = f(x) = x - 1.5
\]

Now let’s try to train the perceptron to give a positive output **only** when exactly one of the inputs is on. No matter how hard we try, we won’t be able to do it, because there’s no way to draw a line that separates just two opposite points from the others. However, it can be done—by **adding another layer** to the perceptron, which gives us two lines instead of one. This breaks our simple perceptron model, since it only allows for two layers, not three. That’s why **multi-layer perceptrons** were invented. In addition to the input and output layers, they have **hidden layers**.

Back when the perceptron was discovered, there was no known method to train multi-layer neural networks, and the technology at the time wasn’t powerful enough to train them the same way. That’s why the idea of neural networks was abandoned for so long. But it was eventually revived years later with the invention of the **backpropagation** algorithm and the use of **GPUs**, which led to today’s rapid advances in AI.

The perceptron has been one of the most important inventions—if not **the** most important—in the history of neural networks, because it was the first machine capable of implementing what the mathematical model of artificial neurons described, and thus, the first machine that could almost learn on its own.

**References**  
[YouTube](https://www.youtube.com/watch?v=l-9ALe3U-Fg)
