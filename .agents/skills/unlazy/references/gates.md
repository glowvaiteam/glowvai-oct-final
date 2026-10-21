# Gate file format

A gate ledger is a machine-checked completion contract. The checker and Stop hook use the same strict parser. Invalid structure fails closed instead of producing a completion certificate.

## Minimal format

```markdown
# Gates: account import

OWNS: src/import/**, tests/import/**

Scope: import valid records and reject malformed records

- [ ] G1: valid fixture imports completely
  CHECK: node scripts/check-import.mjs fixtures/valid.json
  EXPECT: import verification passed
  EVIDENCE: pending

- [ ] G2: package-level integration succeeds
  CHECK: node ../../scripts/check-package.mjs
  EXPECT: package verification passed
  CWD: packages/importer
  EVIDENCE: pending

- [ ] G3: migration wording is reviewed against the product decision
  EVIDENCE: pending

ABANDON: G3 decision owner unavailable; handoff recorded in issue 123
```

The fenced example above is documentation. Lines inside fenced code blocks are ignored by the parser. Fence boundaries follow [CommonMark's fenced-code rules](https://spec.commonmark.org/0.30/#fenced-code-blocks): the closing marker uses the same character, is at least as long as the opener, has no trailing content, and may have up to three leading spaces.

## Strict parsing rules

- Start a gate with `- [ ] ID: outcome` or `- [x] ID: outcome`. Use a non-empty explicit id that is unique within the file. An id-less gate is malformed because line-derived identifiers are not stable when lines move.
- Indent `CHECK:`, `EXPECT:`, `CWD:`, and `EVIDENCE:` beneath their gate. An unindented attribute is diagnosed instead of silently changing the gate into a manual one.
- Give a runnable gate both `CHECK:` and `EXPECT:`. Give a manual gate neither. A partial runnable gate is malformed.
- Use one `EVIDENCE:` line per gate. If it is omitted from an otherwise valid gate, the checker inserts it without changing the file's original CRLF or LF newline style.
- Put the optional `OWNS:` header before the first gate. Separate paths with commas. Paths are repository-relative globs; absolute paths and traversal segments such as `..` are invalid.
- Write `ABANDON: <id> <reason>` only for a gate in the same file. The reason must contain non-whitespace text. An unknown id is a parse error, because silently ignoring a typo could let an otherwise green child promote its parent.
- Start `ABANDON:` at column 1. It names its gate by id, so it is a file-level statement rather than a gate attribute, and it is the one line that must not be indented. An indented `ABANDON:` is diagnosed rather than applied.
- Do not define a ledger with zero gates. A named empty or malformed ledger is a parse error, not `ALL MET`.
- Use `/pattern/flags` for a JavaScript regular-expression expectation or plain text for a substring. An invalid regular expression is a parse error.
- Remember that the wrapping slashes always win. `EXPECT: /etc/app/conf/` is the pattern `etc/app/conf`, not that literal path, so its dots match any character. An unescaped inner slash is warned because both readings are plausible. Escape the inner slashes to keep the pattern, or drop the wrapping slashes and match a distinctive substring such as `etc/app/conf`.

Ids are unique within one file. Tools qualify them with the file stem in tree-wide output, such as `leaf-1.2.1:G3` or `node-1.1:N2`. Use the qualified form in reports and handoffs.

## Success and evidence

A runnable gate passes only when both conditions hold:

1. The process starts and exits with status `0`.
2. `EXPECT:` matches the command's combined standard output and standard error.

A nonzero process never passes merely because its error text contains the expected token. A timeout, shell-start error, missing command, or output-limit failure also fails. The default timeout is 120 seconds; `--timeout` accepts an integer from 1 through 86400.

Lint the ledger before working it:

```text
node <skill-dir>/scripts/gate-lint.mjs GATES.md
```

## Abandonment

Use abandonment only when a required outcome is genuinely impossible within the authorized task. Keep the original gate, add one non-empty reason, and name the abandonment in the final report. An abandonment is a terminal visible handoff, not a passing check.
