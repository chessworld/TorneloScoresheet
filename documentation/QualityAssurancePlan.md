# Quality Assurance Plan

## Approach


## Testing


## Continuous Integration/Continuous Deployment


## Defition Of Done


## Code Review

All Pull Requests for the project are to be reviewed before being merged.

The Code Review process involves the following:
1. The author describes the changes:
    1. Describe which of the story/requirement's acceptance criterias are fulfilled
    2. Include screenshots (if necessary)
    3. Any caveats or potential impact to other parts of the codebase

2. If necessary the author demonstrates and describes the code to the reviewer

4. The reviewer identifies issues and asks questions about the code. Things to look at (in order)
    1. Correctness - Does it work?
    2. Secure - Does it have glaring security holes like plaintext passwords?
    3. Readable - Can you clearly understand the code if the author disappears?
    4. Elegant - Does the code use well-known patterns? Is it concise?
    5. Altruist - Does the code leave the codebase better than what it was? It's better to do small-scale refactoring iteratively.
    6. (For more info, see https://www.dein.fr/posts/2015-02-18-maslows-pyramid-of-code-review)

4. The author answers questions and fixes issues as requested

6. When no more issues are identified, the branch is merged and deleted.

After the code is reviewed either:
- The branch is merged and deleted.
- The merge is declined. Small changes are requested

## Artifacts


