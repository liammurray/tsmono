# TSMono

My mono repo with misc. typescript packages (experimentation or utils)

## Hints

See all including private packages

```bash
lerna list -a
```

Add dependency from one package to another

```bash
# add dependency on correlation-ids
lerna add @nod15c/correlation-ids --scope @nod15c/global-cls-context
```
