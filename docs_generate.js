/**
 * Docs: https://github.com/open-wc/custom-elements-manifest/tree/master/packages/to-markdown
 */
import fs from 'fs';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

const manifest = JSON.parse(fs.readFileSync('./dist/custom-elements.json', 'utf-8'));
const markdown = customElementsManifestToMarkdown(manifest, {
    private: 'hidden',
    omitSections: ['super-class', 'css-properties', 'css-parts', 'main-heading']
});

fs.writeFileSync('./dist/custom-elements.md', markdown);

// TODO: split the generated file into the single readme of each component  
