# Blockquotes

Blockquote styling is handled globally. You don't need to write custom CSS for this.

The styling relies on specific DOM structure.

<blockquote-example>
<figure>
  <blockquote cite="https://example.com/source">
    <p>The only thing we have to fear is fear itself.</p>
  </blockquote>
  <figcaption>— Franklin D. Roosevelt, <cite>First Inaugural Address</cite></figcaption>
</figure>
</blockquote-example>

You can customize blockquote styling by changing pre-defined locally scoped variables:

<custom-blockquote-styling>
.testimonial-blockquote {
  --blockquote-background: var(--primary-ultra-light);
  --blockquote-border-color: var(--primary);
  --blockquote-border-width: 0 0 0 4px;
  --blockquote-padding: var(--space-l);
  --blockquote-text-font-style: italic;
}
</custom-blockquote-styling>

All blockquote styling is controlled through CSS custom properties (variables) that are automatically generated based on your dashboard settings. These variables follow a consistent naming pattern:

### Main Blockquote Variables

--blockquote-padding
--blockquote-gap
--blockquote-border-width
--blockquote-border-style
--blockquote-border-color
--blockquote-border-radius
--blockquote-background
--blockquote-box-shadow
--blockquote-max-inline-size

### Text Variables

Text-related variables apply to <p> elements within blockquotes:

--blockquote-text-color
--blockquote-text-font-family
--blockquote-text-font-style
--blockquote-text-font-size
--blockquote-text-font-weight
--blockquote-text-line-height
--blockquote-text-align
--blockquote-text-transform

### Footer Variables

--blockquote-footer-padding
--blockquote-footer-margin-block
--blockquote-footer-font-family
--blockquote-footer-font-size
--blockquote-footer-font-weight
--blockquote-footer-font-style
--blockquote-footer-line-height
--blockquote-footer-text-transform
--blockquote-footer-color

### Cite Variables

--blockquote-cite-font-size
--blockquote-cite-font-weight
--blockquote-cite-font-style
--blockquote-cite-line-height
--blockquote-cite-text-transform
--blockquote-cite-color
