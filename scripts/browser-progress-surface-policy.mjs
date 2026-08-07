import { lstat, readFile, readdir } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { validateCourseGraph } from "./course-graph.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = resolve(scriptDirectory, "..");

export const browserProgressSurfacePolicyRelativePath =
  "content/course/browser-progress-surfaces.v1.json";
export const browserProgressOwnerBindingPolicyRelativePath =
  "content/course/browser-progress-owner-bindings.v2.json";

const expectedRootKeys = new Set([
  "schemaVersion",
  "policyVersion",
  "kind",
  "purpose",
  "scope",
  "surfaces",
]);
const expectedScopeKeys = new Set([
  "sourceRoots",
  "browserStorageAdapterPath",
  "forbiddenApis",
  "forbiddenMethods",
  "requiredEnvelopeKeys",
  "forbiddenDataClasses",
]);
const expectedSurfaceKeys = new Set([
  "id",
  "owner",
  "route",
  "clientPaths",
  "adapter",
  "current",
  "legacy",
  "reset",
  "tests",
]);
const expectedCurrentKeys = new Set([
  "key",
  "keyVersion",
  "envelopeVersion",
  "codecKind",
  "recordPaths",
  "allowedDataClasses",
  "meaningfulWriteOnly",
  "maxSerializedBytes",
]);
const expectedLegacyKeys = new Set([
  "key",
  "keyVersion",
  "strategy",
  "fallbackWhenCurrentPresent",
]);
const expectedAdapterKeys = new Set(["path", "codecExport", "operations"]);
const expectedTestKeys = new Set(["unit", "browser"]);
const expectedResetKeys = new Set(["removeKeys"]);
const expectedLegacyOwnerKeys = new Set(["moduleId", "lifecycle"]);
const expectedCurrentOwnerKeys = new Set(["moduleId", "availability"]);
const expectedOwnerBindingPolicyRootKeys = new Set([
  "schemaVersion",
  "policyVersion",
  "kind",
  "purpose",
  "surfacePolicy",
  "bindings",
]);
const expectedOwnerBindingSourcePolicyKeys = new Set([
  "path",
  "schemaVersion",
  "policyVersion",
]);
const expectedOwnerBindingKeys = new Set(["surfaceId", "owner"]);
const expectedSurfaceIds = [
  "intake",
  "m18-os-studio",
  "m19-concurrency-studio",
  "m20-protocol-studio",
  "m21-async-distributed-studio",
  "m22-security-trust-studio",
  "m23-language-lab",
  "m24-runtime-observatory",
  "m25-evidence-studio",
  "m26-capstone-defense",
  "m27-discrete-math-studio",
  "m28-linear-algebra-studio",
  "m29-calculus-studio",
  "m30-probability-studio",
];
const expectedLegacyLifecycleBySurfaceId = new Map([
  ["intake", "published-foundation"],
  ["m18-os-studio", "published"],
  ["m19-concurrency-studio", "published"],
  ["m20-protocol-studio", "published"],
  ["m21-async-distributed-studio", "published"],
  ["m22-security-trust-studio", "published"],
  ["m23-language-lab", "published"],
  ["m24-runtime-observatory", "published"],
  ["m25-evidence-studio", "preview"],
  ["m26-capstone-defense", "preview"],
  ["m27-discrete-math-studio", "published"],
  ["m28-linear-algebra-studio", "published"],
  ["m29-calculus-studio", "published"],
  ["m30-probability-studio", "published"],
]);
const storageNames = new Set(["localStorage", "sessionStorage"]);
const directStorageMethods = new Set(["getItem", "setItem", "removeItem", "clear"]);
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasExactlyKeys(value, expected) {
  return (
    isPlainObject(value) &&
    Object.keys(value).length === expected.size &&
    Object.keys(value).every((key) => expected.has(key))
  );
}

function isPathInside(siteRoot, candidate) {
  const repositoryPath = relative(siteRoot, candidate).replaceAll("\\", "/");
  return (
    repositoryPath !== "" &&
    !repositoryPath.startsWith("../") &&
    !repositoryPath.includes(":")
  );
}

function repositoryPath(siteRoot, candidate) {
  return relative(siteRoot, candidate).replaceAll("\\", "/");
}

function validateStringArray(value, label, errors, { minimum = 0 } = {}) {
  if (!Array.isArray(value) || value.some((entry) => text(entry) === "")) {
    errors.push(`${label} must be an array of non-empty strings.`);
    return [];
  }
  if (value.length < minimum) {
    errors.push(`${label} must include at least ${minimum} value(s).`);
  }
  if (new Set(value).size !== value.length) {
    errors.push(`${label} must not contain duplicates.`);
  }
  return value;
}

async function regularSourceFile(siteRoot, path, label, errors) {
  if (text(path) === "") {
    errors.push(`${label} must be a non-empty repository path.`);
    return null;
  }
  const absolutePath = resolve(siteRoot, path);
  if (!isPathInside(siteRoot, absolutePath) || repositoryPath(siteRoot, absolutePath) !== path) {
    errors.push(`${label} must stay inside the repository without path normalization.`);
    return null;
  }
  const stats = await lstat(absolutePath).catch(() => null);
  if (!stats || !stats.isFile() || stats.isSymbolicLink()) {
    errors.push(`${label} must be a regular checked-in file: ${path}.`);
    return null;
  }
  return absolutePath;
}

async function collectSourceFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const entryPath = resolve(root, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await collectSourceFiles(entryPath)));
    } else if (entry.isFile() && sourceExtensions.has(extname(entry.name))) {
      paths.push(entryPath);
    }
  }
  return paths;
}

function scriptKindFor(path) {
  switch (extname(path)) {
    case ".tsx":
      return ts.ScriptKind.TSX;
    case ".ts":
      return ts.ScriptKind.TS;
    case ".jsx":
      return ts.ScriptKind.JSX;
    default:
      return ts.ScriptKind.JS;
  }
}

function parseSource(path, content) {
  return ts.createSourceFile(
    path,
    content,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(path),
  );
}

function staticStringValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isParenthesizedExpression(node)) {
    return staticStringValue(node.expression);
  }
  if (
    ts.isBinaryExpression(node) &&
    node.operatorToken.kind === ts.SyntaxKind.PlusToken
  ) {
    const left = staticStringValue(node.left);
    const right = staticStringValue(node.right);
    return left !== null && right !== null ? `${left}${right}` : null;
  }
  return null;
}

function propertyText(node) {
  if (ts.isPropertyAccessExpression(node)) return node.name.text;
  if (ts.isElementAccessExpression(node)) {
    return staticStringValue(node.argumentExpression);
  }
  return null;
}

function isGlobalObjectExpression(node) {
  return ts.isIdentifier(node) && (node.text === "window" || node.text === "globalThis");
}

function reflectGetStorageName(node) {
  if (!ts.isCallExpression(node)) return null;
  if (node.arguments.length < 2) return null;
  const expression = node.expression;
  if (
    !(ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) ||
    !ts.isIdentifier(expression.expression) ||
    expression.expression.text !== "Reflect" ||
    propertyText(expression) !== "get" ||
    !isGlobalObjectExpression(node.arguments[0])
  ) {
    return null;
  }
  const storageName = staticStringValue(node.arguments[1]);
  return storageName !== null && storageNames.has(storageName) ? storageName : null;
}

function isDynamicGlobalStorageLookup(node) {
  if (
    ts.isElementAccessExpression(node) &&
    isGlobalObjectExpression(node.expression) &&
    propertyText(node) === null
  ) {
    return true;
  }
  if (!ts.isCallExpression(node)) return false;
  if (node.arguments.length < 2) return false;
  const expression = node.expression;
  return Boolean(
    (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) &&
      ts.isIdentifier(expression.expression) &&
      expression.expression.text === "Reflect" &&
      propertyText(expression) === "get" &&
      isGlobalObjectExpression(node.arguments[0]) &&
      staticStringValue(node.arguments[1]) === null,
  );
}

function directStorageReference(node) {
  const reflectedStorageName = reflectGetStorageName(node);
  if (reflectedStorageName) return reflectedStorageName;
  if (
    ts.isIdentifier(node) &&
    storageNames.has(node.text) &&
    !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node)
  ) {
    return node.text;
  }
  if (
    (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) &&
    storageNames.has(propertyText(node)) &&
    isGlobalObjectExpression(node.expression)
  ) {
    return propertyText(node);
  }
  return null;
}

export function scanBrowserProgressSource(path, content) {
  const source = parseSource(path, content);
  const storageReferences = [];
  const storageMethodCalls = [];
  const dynamicGlobalStorageProperties = [];

  function visit(node) {
    const storageName = directStorageReference(node);
    if (storageName) {
      const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
      storageReferences.push({ storageName, line: line + 1, column: character + 1 });
    }
    if (isDynamicGlobalStorageLookup(node)) {
      const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
      dynamicGlobalStorageProperties.push({ line: line + 1, column: character + 1 });
    }
    if (ts.isCallExpression(node)) {
      const method = propertyText(node.expression);
      if (method && directStorageMethods.has(method)) {
        const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
        storageMethodCalls.push({ method, line: line + 1, column: character + 1 });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return { storageReferences, storageMethodCalls, dynamicGlobalStorageProperties };
}

function statementIsExported(statement) {
  return statement.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
  );
}

function sourceExportsName(path, content, name) {
  const source = parseSource(path, content);
  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement) && statement.exportClause) {
      if (ts.isNamedExports(statement.exportClause)) {
        if (
          statement.exportClause.elements.some(
            (element) => element.name.text === name,
          )
        ) {
          return true;
        }
      }
      continue;
    }
    if (!statementIsExported(statement)) continue;
    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name?.text === name
    ) {
      return true;
    }
    if (ts.isVariableStatement(statement)) {
      if (
        statement.declarationList.declarations.some(
          (declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === name,
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

function importPathStem(specifier) {
  return specifier
    .replaceAll("\\", "/")
    .replace(/^@\//u, "")
    .replace(/\.(?:[cm]?[jt]sx?)$/u, "");
}

function codecSpecifierMatchesPath(specifier, codecPath) {
  return importPathStem(specifier).endsWith(
    codecPath.replace(/\.js$/u, ""),
  );
}

function isBrowserProgressStorageSpecifier(specifier) {
  return importPathStem(specifier).endsWith("lib/browser-progress-storage");
}

function isProgressCodecSpecifier(specifier) {
  return /(?:^|\/)(?:diagnostic|module[0-9]+)-progress-codec$/u.test(
    importPathStem(specifier),
  );
}

function isLifecycleOperationName(name) {
  return /^(?:restore|persist|clear)[A-Z][A-Za-z0-9]*Progress$/u.test(name);
}

export function scanBrowserProgressImports(path, content) {
  const source = parseSource(path, content);
  const seamBindings = new Set();
  const lifecycleBindings = [];
  const dynamicProgressImports = [];
  let seamImportFound = false;

  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const specifier = staticStringValue(statement.moduleSpecifier);
    if (specifier === null) continue;
    const importClause = statement.importClause;
    const bindings = importClause?.namedBindings;
    if (isBrowserProgressStorageSpecifier(specifier)) {
      seamImportFound = true;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const binding of bindings.elements) {
          const importedName = binding.propertyName?.text ?? binding.name.text;
          if (importedName === "getBrowserProgressStorage") {
            seamBindings.add(binding.name.text);
          }
        }
      } else {
        dynamicProgressImports.push({
          kind: "non-named seam import",
          line: source.getLineAndCharacterOfPosition(statement.getStart(source)).line + 1,
        });
      }
    }
    if (isProgressCodecSpecifier(specifier)) {
      if (bindings && ts.isNamedImports(bindings)) {
        for (const binding of bindings.elements) {
          lifecycleBindings.push({
            specifier,
            importedName: binding.propertyName?.text ?? binding.name.text,
            localName: binding.name.text,
          });
        }
      } else {
        dynamicProgressImports.push({
          kind: "non-named lifecycle import",
          line: source.getLineAndCharacterOfPosition(statement.getStart(source)).line + 1,
        });
      }
    }
  }

  const calledLocalNames = new Set();
  const importedLocalNames = new Set([
    ...seamBindings,
    ...lifecycleBindings.map(({ localName }) => localName),
  ]);
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      const specifier = staticStringValue(node.arguments[0]);
      if (
        specifier !== null &&
        (isBrowserProgressStorageSpecifier(specifier) || isProgressCodecSpecifier(specifier))
      ) {
        const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
        dynamicProgressImports.push({ kind: "dynamic progress import", line: line + 1 });
      }
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      if (importedLocalNames.has(node.expression.text)) {
        calledLocalNames.add(node.expression.text);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return {
    seamImportFound,
    seamBindings,
    lifecycleBindings,
    calledLocalNames,
    dynamicProgressImports,
  };
}

function hasUseClientDirective(path, content) {
  const source = parseSource(path, content);
  const firstStatement = source.statements[0];
  return Boolean(
    firstStatement &&
      ts.isExpressionStatement(firstStatement) &&
      ts.isStringLiteral(firstStatement.expression) &&
      firstStatement.expression.text === "use client",
  );
}

export function browserProgressSurfacePolicyPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, browserProgressSurfacePolicyRelativePath);
}

export function browserProgressOwnerBindingPolicyPath(siteRoot = defaultSiteRoot) {
  return resolve(siteRoot, browserProgressOwnerBindingPolicyRelativePath);
}

export async function loadBrowserProgressSurfacePolicy(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(browserProgressSurfacePolicyPath(siteRoot), "utf8"));
}

export async function loadBrowserProgressOwnerBindingPolicy(siteRoot = defaultSiteRoot) {
  return JSON.parse(await readFile(browserProgressOwnerBindingPolicyPath(siteRoot), "utf8"));
}

function validateOwnerBindingPolicy(ownerBindingPolicy, graphModulesById, errors) {
  if (!hasExactlyKeys(ownerBindingPolicy, expectedOwnerBindingPolicyRootKeys)) {
    errors.push("Browser-progress owner-binding policy must use its exact versioned root schema.");
  }
  if (
    ownerBindingPolicy?.schemaVersion !== 2 ||
    ownerBindingPolicy?.policyVersion !== "v2" ||
    ownerBindingPolicy?.kind !== "atlas-browser-progress-owner-binding-policy"
  ) {
    errors.push("Browser-progress owner-binding policy must use schemaVersion 2, policyVersion v2, and the expected kind.");
  }
  if (text(ownerBindingPolicy?.purpose) === "") {
    errors.push("Browser-progress owner-binding policy must define a non-empty purpose.");
  }

  const sourcePolicy = hasExactlyKeys(
    ownerBindingPolicy?.surfacePolicy,
    expectedOwnerBindingSourcePolicyKeys,
  )
    ? ownerBindingPolicy.surfacePolicy
    : null;
  if (!sourcePolicy) {
    errors.push("Browser-progress owner-binding policy must declare its exact v1 source policy.");
  } else if (
    sourcePolicy.path !== browserProgressSurfacePolicyRelativePath ||
    sourcePolicy.schemaVersion !== 1 ||
    sourcePolicy.policyVersion !== "v1"
  ) {
    errors.push("Browser-progress owner-binding policy must bind exactly browser-progress-surfaces.v1.json schemaVersion 1 policyVersion v1.");
  }

  const bindings = Array.isArray(ownerBindingPolicy?.bindings)
    ? ownerBindingPolicy.bindings
    : [];
  if (bindings.length !== expectedSurfaceIds.length) {
    errors.push(`Browser-progress owner-binding policy must declare exactly ${expectedSurfaceIds.length} bindings.`);
  }
  const bindingSurfaceIds = bindings.map((binding) => binding?.surfaceId);
  if (JSON.stringify(bindingSurfaceIds) !== JSON.stringify(expectedSurfaceIds)) {
    errors.push("Browser-progress owner-binding policy must preserve the canonical 14-surface order and IDs.");
  }
  if (new Set(bindingSurfaceIds).size !== bindingSurfaceIds.length) {
    errors.push("Browser-progress owner-binding policy must not duplicate surface IDs.");
  }

  const bindingsBySurfaceId = new Map();
  for (const [index, binding] of bindings.entries()) {
    const label = `Browser-progress owner binding ${index + 1}`;
    if (!hasExactlyKeys(binding, expectedOwnerBindingKeys)) {
      errors.push(`${label} must use the exact binding schema.`);
      continue;
    }
    if (
      !hasExactlyKeys(binding.owner, expectedCurrentOwnerKeys) ||
      text(binding.surfaceId) === "" ||
      text(binding.owner.moduleId) === "" ||
      text(binding.owner.availability) === ""
    ) {
      errors.push(`${label} must identify a surface, module owner, and canonical availability.`);
      continue;
    }
    bindingsBySurfaceId.set(binding.surfaceId, binding);
    if (binding.owner.moduleId === "intake") {
      if (binding.surfaceId !== "intake" || binding.owner.availability !== "diagnostic") {
        errors.push(`${label} intake binding must use the intake surface and diagnostic availability.`);
      }
      continue;
    }
    const ownerModule = graphModulesById.get(binding.owner.moduleId);
    if (!ownerModule) {
      errors.push(`${label} owner must name a canonical module.`);
      continue;
    }
    if (binding.owner.availability !== ownerModule.state.availability) {
      errors.push(`${label} owner availability must match canonical Module ${ownerModule.number} availability ${ownerModule.state.availability}.`);
    }
  }
  return bindingsBySurfaceId;
}

/**
 * Verify the checked-in, non-runtime policy that maps every learner-progress
 * surface to its codec interface and forbids a new ad-hoc Web Storage path.
 * This is a static policy gate, not an assertion that local storage is
 * encrypted, authenticated, or proof of mastery.
 */
export async function validateBrowserProgressSurfacePolicy(
  policy,
  { siteRoot = defaultSiteRoot, ownerBindingPolicy: suppliedOwnerBindingPolicy = null } = {},
) {
  const errors = [];
  let graphModulesById = new Map();
  try {
    const graph = JSON.parse(
      await readFile(resolve(siteRoot, "content", "course", "course-graph.v2.json"), "utf8"),
    );
    validateCourseGraph(graph);
    graphModulesById = new Map(graph.modules.map((courseModule) => [courseModule.id, courseModule]));
  } catch (error) {
    errors.push(
      `Browser-progress policy needs a valid canonical course graph: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  let ownerBindingPolicy = suppliedOwnerBindingPolicy;
  if (!ownerBindingPolicy) {
    try {
      ownerBindingPolicy = await loadBrowserProgressOwnerBindingPolicy(siteRoot);
    } catch (error) {
      errors.push(
        `Browser-progress policy needs its v2 canonical owner bindings: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  const ownerBindingsBySurfaceId = ownerBindingPolicy
    ? validateOwnerBindingPolicy(ownerBindingPolicy, graphModulesById, errors)
    : new Map();
  if (!hasExactlyKeys(policy, expectedRootKeys)) {
    errors.push("Browser-progress policy must use its exact versioned root schema.");
  }
  if (
    policy?.schemaVersion !== 1 ||
    policy?.policyVersion !== "v1" ||
    policy?.kind !== "atlas-browser-progress-surface-policy"
  ) {
    errors.push("Browser-progress policy must retain schemaVersion 1, policyVersion v1, and the expected kind.");
  }
  if (text(policy?.purpose) === "") {
    errors.push("Browser-progress policy must define a non-empty purpose.");
  }

  const scope = hasExactlyKeys(policy?.scope, expectedScopeKeys) ? policy.scope : null;
  if (!scope) {
    errors.push("Browser-progress policy scope must use the exact reviewed schema.");
  }
  const sourceRoots = scope
    ? validateStringArray(scope.sourceRoots, "Browser-progress policy sourceRoots", errors, {
        minimum: 2,
      })
    : [];
  if (scope && JSON.stringify(sourceRoots) !== JSON.stringify(["app", "lib"])) {
    errors.push("Browser-progress policy must scan exactly app and lib source roots.");
  }
  if (scope && scope.browserStorageAdapterPath !== "lib/browser-progress-storage.js") {
    errors.push("Browser-progress policy must retain lib/browser-progress-storage.js as the sole browser-storage seam.");
  }
  if (scope && JSON.stringify(scope.forbiddenApis) !== JSON.stringify(["sessionStorage"])) {
    errors.push("Browser-progress policy must forbid sessionStorage.");
  }
  if (scope && JSON.stringify(scope.forbiddenMethods) !== JSON.stringify(["clear"])) {
    errors.push("Browser-progress policy must forbid Storage.clear().");
  }
  if (scope && JSON.stringify(scope.requiredEnvelopeKeys) !== JSON.stringify(["version", "record"])) {
    errors.push("Browser-progress policy must require the exact version/record envelope.");
  }
  const forbiddenDataClasses = scope
    ? validateStringArray(scope.forbiddenDataClasses, "Browser-progress policy forbiddenDataClasses", errors, {
        minimum: 1,
      })
    : [];

  if (scope) {
    await regularSourceFile(
      siteRoot,
      scope.browserStorageAdapterPath,
      "Browser-storage adapter path",
      errors,
    );
  }

  const surfaces = Array.isArray(policy?.surfaces) ? policy.surfaces : [];
  if (surfaces.length !== expectedSurfaceIds.length) {
    errors.push(`Browser-progress policy must declare exactly ${expectedSurfaceIds.length} learner-progress surfaces.`);
  }
  const surfaceIds = surfaces.map((surface) => surface?.id);
  if (JSON.stringify(surfaceIds) !== JSON.stringify(expectedSurfaceIds)) {
    errors.push("Browser-progress policy must preserve the canonical 14-surface order and IDs.");
  }

  const declaredCodecPaths = new Set();
  const declaredClientPaths = new Set();
  const declaredClientRequirements = new Map();
  const declaredKeys = new Set();
  const surfaceReports = [];

  for (const [index, surface] of surfaces.entries()) {
    const label = `Browser-progress surface ${index + 1}`;
    if (!hasExactlyKeys(surface, expectedSurfaceKeys)) {
      errors.push(`${label} must use the exact surface schema.`);
      continue;
    }
    if (text(surface.id) === "") errors.push(`${label} needs a stable ID.`);
    if (
      !hasExactlyKeys(surface.owner, expectedLegacyOwnerKeys) ||
      text(surface.owner.moduleId) === "" ||
      text(surface.owner.lifecycle) === ""
    ) {
      errors.push(`${label} must retain the v1 module-owner and historical lifecycle schema.`);
    } else {
      const expectedLifecycle = expectedLegacyLifecycleBySurfaceId.get(surface.id);
      if (expectedLifecycle && surface.owner.lifecycle !== expectedLifecycle) {
        errors.push(`${label} must retain its v1 historical lifecycle value ${expectedLifecycle}.`);
      }
    }
    const ownerBinding = ownerBindingsBySurfaceId.get(surface.id);
    if (!ownerBinding) {
      errors.push(`${label} must have exactly one v2 canonical owner binding.`);
    } else if (surface.owner?.moduleId !== ownerBinding.owner.moduleId) {
      errors.push(`${label} v1 owner module must match its v2 canonical owner binding.`);
    } else if (ownerBinding.owner.moduleId !== "intake") {
      const ownerModule = graphModulesById.get(ownerBinding.owner.moduleId);
      if (ownerModule && surface.route !== `/modules/${ownerModule.slug}`) {
        errors.push(`${label} route must match canonical Module ${ownerModule.number} reader route.`);
      }
    }
    if (text(surface.route) === "" || !surface.route.startsWith("/")) {
      errors.push(`${label} must declare an absolute learner route.`);
    }

    const clientPaths = validateStringArray(surface.clientPaths, `${label} clientPaths`, errors, {
      minimum: 1,
    });
    const adapter = hasExactlyKeys(surface.adapter, expectedAdapterKeys) ? surface.adapter : null;
    if (!adapter) {
      errors.push(`${label} adapter must use the exact adapter schema.`);
      continue;
    }
    const current = hasExactlyKeys(surface.current, expectedCurrentKeys) ? surface.current : null;
    if (!current) {
      errors.push(`${label} current record must use the exact current-record schema.`);
      continue;
    }
    const legacy = Array.isArray(surface.legacy) ? surface.legacy : null;
    if (!legacy) errors.push(`${label} legacy records must be an array.`);
    const reset = hasExactlyKeys(surface.reset, expectedResetKeys) ? surface.reset : null;
    if (!reset) errors.push(`${label} reset must use the exact reset schema.`);
    const tests = hasExactlyKeys(surface.tests, expectedTestKeys) ? surface.tests : null;
    if (!tests) errors.push(`${label} tests must use the exact test schema.`);

    if (
      typeof current.key !== "string" ||
      !/^(?:atlas|atlas-academy)(?:[.:])[a-z0-9:.-]+[.-]v[1-9][0-9]*$/u.test(current.key)
    ) {
      errors.push(`${label} current key must use a versioned Atlas namespace.`);
    } else if (declaredKeys.has(current.key)) {
      errors.push(`${label} current key duplicates another declared key.`);
    } else {
      declaredKeys.add(current.key);
    }
    if (!Number.isInteger(current.keyVersion) || current.keyVersion < 1) {
      errors.push(`${label} current keyVersion must be a positive integer.`);
    }
    if (!Number.isInteger(current.envelopeVersion) || current.envelopeVersion < 1) {
      errors.push(`${label} current envelopeVersion must be a positive integer.`);
    }
    if (!new Set(["prediction-triads", "custom-allowlisted"]).has(current.codecKind)) {
      errors.push(`${label} current codecKind is not allowlisted.`);
    }
    const recordPaths = validateStringArray(current.recordPaths, `${label} current recordPaths`, errors, {
      minimum: 1,
    });
    if (recordPaths.some((path) => !/^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/u.test(path))) {
      errors.push(`${label} record paths must be fixed dotted identifiers.`);
    }
    const allowedDataClasses = validateStringArray(
      current.allowedDataClasses,
      `${label} current allowedDataClasses`,
      errors,
      { minimum: 1 },
    );
    if (allowedDataClasses.some((dataClass) => forbiddenDataClasses.includes(dataClass))) {
      errors.push(`${label} allows a forbidden browser-progress data class.`);
    }
    if (current.meaningfulWriteOnly !== true) {
      errors.push(`${label} must write only meaningful learner-progress evidence.`);
    }
    if (!Number.isInteger(current.maxSerializedBytes) || current.maxSerializedBytes < 64 || current.maxSerializedBytes > 4096) {
      errors.push(`${label} maxSerializedBytes must be a conservative 64–4096 byte integer bound.`);
    }

    const legacyKeys = [];
    for (const [legacyIndex, legacyRecord] of (legacy ?? []).entries()) {
      const legacyLabel = `${label} legacy ${legacyIndex + 1}`;
      if (!hasExactlyKeys(legacyRecord, expectedLegacyKeys)) {
        errors.push(`${legacyLabel} must use the exact legacy schema.`);
        continue;
      }
      if (
        typeof legacyRecord.key !== "string" ||
        !/^(?:atlas|atlas-academy)(?:[.:])[a-z0-9:.-]+[.-]v[1-9][0-9]*$/u.test(legacyRecord.key)
      ) {
        errors.push(`${legacyLabel} key must use a versioned Atlas namespace.`);
      } else if (declaredKeys.has(legacyRecord.key)) {
        errors.push(`${legacyLabel} key duplicates another declared key.`);
      } else {
        declaredKeys.add(legacyRecord.key);
      }
      legacyKeys.push(legacyRecord.key);
      if (!Number.isInteger(legacyRecord.keyVersion) || legacyRecord.keyVersion < 1) {
        errors.push(`${legacyLabel} keyVersion must be a positive integer.`);
      }
      if (!new Set(["retire", "migrate-meaningful-current-first"]).has(legacyRecord.strategy)) {
        errors.push(`${legacyLabel} strategy must retire or perform an explicit current-first migration.`);
      }
      if (legacyRecord.fallbackWhenCurrentPresent !== false) {
        errors.push(`${legacyLabel} must forbid legacy fallback when a current key is present.`);
      }
    }

    const resetKeys = reset
      ? validateStringArray(reset.removeKeys, `${label} reset removeKeys`, errors, { minimum: 1 })
      : [];
    const expectedSurfaceResetKeys = [current.key, ...legacyKeys].sort();
    if (JSON.stringify([...resetKeys].sort()) !== JSON.stringify(expectedSurfaceResetKeys)) {
      errors.push(`${label} reset must remove exactly its current and legacy keys.`);
    }

    const operationNames = adapter
      ? validateStringArray(adapter.operations, `${label} adapter operations`, errors, { minimum: 3 })
      : [];
    if (
      operationNames.length === 3 &&
      !operationNames.every((name) => /^(?:restore|persist|clear)[A-Z][A-Za-z0-9]*Progress$/u.test(name))
    ) {
      errors.push(`${label} adapter must expose restore, persist, and clear Progress operations.`);
    }
    if (adapter && text(adapter.codecExport) === "") {
      errors.push(`${label} adapter needs a codec export.`);
    }
    const codecPath = adapter
      ? await regularSourceFile(siteRoot, adapter.path, `${label} adapter path`, errors)
      : null;
    if (adapter && declaredCodecPaths.has(adapter.path)) {
      errors.push(`${label} shares a codec adapter path; each surface needs a dedicated lifecycle owner.`);
    } else if (adapter) {
      declaredCodecPaths.add(adapter.path);
    }

    const clientSourcePaths = [];
    for (const clientPath of clientPaths) {
      if (declaredClientPaths.has(clientPath)) {
        errors.push(`${label} client path duplicates another surface: ${clientPath}.`);
      } else {
        declaredClientPaths.add(clientPath);
      }
      const absolutePath = await regularSourceFile(siteRoot, clientPath, `${label} client path`, errors);
      if (absolutePath) {
        clientSourcePaths.push(absolutePath);
        declaredClientRequirements.set(clientPath, {
          codecPath: adapter?.path,
          operationNames,
        });
      }
    }
    const testPaths = tests
      ? [
          await regularSourceFile(siteRoot, tests.unit, `${label} unit test`, errors),
          await regularSourceFile(siteRoot, tests.browser, `${label} browser test`, errors),
        ].filter(Boolean)
      : [];

    if (codecPath) {
      const codecSource = await readFile(codecPath, "utf8");
      const relativeCodecPath = repositoryPath(siteRoot, codecPath);
      if (!sourceExportsName(relativeCodecPath, codecSource, adapter.codecExport)) {
        errors.push(`${label} adapter does not export declared codec ${adapter.codecExport}.`);
      }
      for (const operationName of operationNames) {
        if (!sourceExportsName(relativeCodecPath, codecSource, operationName)) {
          errors.push(`${label} adapter does not export ${operationName}.`);
        }
      }
      if (!/create(?:Prediction|Versioned)ProgressCodec/u.test(codecSource)) {
        errors.push(`${label} adapter must use a shared versioned allowlisted codec.`);
      }
    }
    for (const clientPath of clientSourcePaths) {
      const clientSource = await readFile(clientPath, "utf8");
      const relativeClientPath = repositoryPath(siteRoot, clientPath);
      if (!hasUseClientDirective(relativeClientPath, clientSource)) {
        errors.push(`${label} client path must be a client module: ${repositoryPath(siteRoot, clientPath)}.`);
      }
      const imports = scanBrowserProgressImports(relativeClientPath, clientSource);
      if (!imports.seamImportFound || imports.seamBindings.size === 0) {
        errors.push(`${label} client path must import getBrowserProgressStorage through the sole seam.`);
      } else if (
        ![...imports.seamBindings].some((binding) => imports.calledLocalNames.has(binding))
      ) {
        errors.push(`${label} client path must call getBrowserProgressStorage through the sole seam.`);
      }
      for (const binding of imports.lifecycleBindings) {
        if (!isLifecycleOperationName(binding.importedName)) continue;
        if (!codecSpecifierMatchesPath(binding.specifier, adapter.path)) {
          errors.push(`${label} client path imports an undeclared progress lifecycle module: ${binding.specifier}.`);
        } else if (!operationNames.includes(binding.importedName)) {
          errors.push(`${label} client path imports undeclared lifecycle operation ${binding.importedName}.`);
        }
      }
      for (const operationName of operationNames) {
        const matchingBindings = imports.lifecycleBindings.filter(
          (binding) =>
            codecSpecifierMatchesPath(binding.specifier, adapter.path) &&
            binding.importedName === operationName,
        );
        if (
          matchingBindings.length === 0 ||
          !matchingBindings.some((binding) => imports.calledLocalNames.has(binding.localName))
        ) {
          errors.push(`${label} client path does not call its declared ${operationName} lifecycle operation.`);
        }
      }
    }
    surfaceReports.push({
      id: surface.id,
      clientPaths: clientPaths,
      codecPath: adapter?.path,
      currentKey: current.key,
      legacyKeys,
      testPaths: testPaths.map((path) => repositoryPath(siteRoot, path)),
    });
  }

  const declaredClientPathSet = new Set([...declaredClientPaths]);
  for (const sourceRoot of sourceRoots) {
    const root = resolve(siteRoot, sourceRoot);
    const sources = await collectSourceFiles(root);
    for (const sourcePath of sources) {
      const relativePath = repositoryPath(siteRoot, sourcePath);
      const source = await readFile(sourcePath, "utf8");
      const scan = scanBrowserProgressSource(relativePath, source);
      const imports = scanBrowserProgressImports(relativePath, source);
      if (relativePath.startsWith("app/")) {
        const hasProgressImport =
          imports.seamImportFound ||
          imports.lifecycleBindings.length > 0 ||
          imports.dynamicProgressImports.length > 0;
        if (hasProgressImport && !declaredClientRequirements.has(relativePath)) {
          errors.push(`${relativePath} imports a browser-progress seam or lifecycle without a declared policy surface.`);
        }
        for (const dynamicImport of imports.dynamicProgressImports) {
          errors.push(`${relativePath}:${dynamicImport.line} may not use ${dynamicImport.kind}; browser-progress imports must be declared static named imports.`);
        }
      }
      for (const reference of scan.storageReferences) {
        if (reference.storageName === "sessionStorage") {
          errors.push(`${relativePath}:${reference.line}:${reference.column} references forbidden sessionStorage.`);
        } else if (relativePath !== scope?.browserStorageAdapterPath) {
          errors.push(`${relativePath}:${reference.line}:${reference.column} bypasses the sole browser-progress storage seam.`);
        }
      }
      for (const reference of scan.dynamicGlobalStorageProperties) {
        errors.push(`${relativePath}:${reference.line}:${reference.column} dynamically accesses window/globalThis; browser-storage properties must be statically named.`);
      }
      if (relativePath.startsWith("app/") && scan.storageMethodCalls.length > 0) {
        for (const call of scan.storageMethodCalls) {
          errors.push(`${relativePath}:${call.line}:${call.column} directly calls ${call.method}; app code must use its declared progress lifecycle module.`);
        }
      }
      if (relativePath.startsWith("app/") && declaredClientPathSet.has(relativePath)) {
        for (const method of scan.storageMethodCalls.filter((call) => call.method === "clear")) {
          errors.push(`${relativePath}:${method.line}:${method.column} may not call Storage.clear().`);
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Browser-progress surface policy validation failed:\n- ${errors.join("\n- ")}`);
  }
  return {
    policyPath: browserProgressSurfacePolicyRelativePath,
    ownerBindingPolicyPath: browserProgressOwnerBindingPolicyRelativePath,
    adapterPath: scope.browserStorageAdapterPath,
    surfaces: surfaceReports,
    releaseInputPaths: [
      browserProgressSurfacePolicyPath(siteRoot),
      browserProgressOwnerBindingPolicyPath(siteRoot),
    ],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const policy = await loadBrowserProgressSurfacePolicy();
  const report = await validateBrowserProgressSurfacePolicy(policy);
  console.log(
    `Browser-progress policy: ${report.surfaces.length} bounded learner-progress surfaces through ${report.adapterPath}.`,
  );
}
