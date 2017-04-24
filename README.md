# Better Choices Quiz
This is a simple javascript app that presents a quiz to a user and scores the results.

## Editing the `choices.json` file
This file stores all of the data to populate the Green Theater Better Choices quiz. To make changes to the quiz content, change the score values, or add extra content like pros and cons for each item, you only have to edit this file and the changes will automatically populate the quiz.

### How is it organized?
The structure is an array of objects, each one representing a section on the quiz, like "Metals". Each section has only two elements: the title of the section (e.g., "Metals") and the various choices that a user could select. The sections aren't numbered explicitly; the quiz just shows them in the order that they appear in this file. In the quiz they are numbered like "Section 1" and "Section 2", etc.

### What does the structure look like?
Each section has a title and an array of `choices`. Each element in that array looks like this:

Element | Description
--- | ---
`uid` | A unique identifier for this item. It can be anything but it needs to be unique so that users can return to their quiz results later. See notes about ID below.
`text` | The title or name of the item. You can use HTML entities here (like `&reg;` to create a registered symbol).
`value` | The score for this item, from 0 to 4.
`pros` | An array of text strings that will be displayed with a thumbs-up under the item when viewing pros & cons. Usually there is only one item in this array but you can have as many as you want if there are multiple "pros" for this item!
`cons` | Same as "pros" but for adding "cons" about this item.
`alternatives` | Same as "pros" and "cons" but used for other information, like links to other products or recommendations. Note that you can put HTML (like links) in here and it will be rendered in the quiz.
      
### Important notes about the ID elements
Each item in this file includes a unique ID (for now just a number). This gets encoded in the URL when someone takes the quiz so that they can return to their results later. Therefore you want to make sure that these ID's stay unique over time. If you need to change an item significantly, you might consider changing the ID so that if a person returns later, the old results are still accurate. Note, however, that if you change an ID or remove an item from this list, and the person returns to view their results, it will NOT show up for them!
