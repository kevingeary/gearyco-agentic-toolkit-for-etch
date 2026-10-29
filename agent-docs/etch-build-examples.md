# Etch build examples

Worked examples for Build mode. The rules they illustrate are in `AGENTS.md`.

## WordPress loop parameters (Loop Manager)

Output WP Query arguments in the format Etch's Loop Manager expects:

```php
$query_args = [
  'post_type' => 'post',
  'posts_per_page' => $count ?? 3,
  'orderby' => 'date',
  'order' => 'DESC',
  'post_status' => 'publish'
];
```

Use `$variable` tokens for configurable values. Use `?? default` for optional arguments.

## Example 1: Loop with query args

**User**: I want to show the 3 latest blog posts on the homepage.

The user wants to display a collection of items, so use a loop: create a loop definition first, then return the code to be used on the page.

1. Call `create_etch_loop_definition` to create the loop definition that the loop element consumes:

```json
{
  "key": "posts-by-title",
  "name": "Posts by Title",
  "type": "wp-query",
  "args": {
    "post_type": "post",
    "posts_per_page": 3,
    "orderby": "date",
    "order": "DESC",
    "post_status": "publish",
    "ignore_sticky_posts": -1
  }
}
```

2. Return the markup:

```html
<ul class="latest-posts-list" role="list">
	{#loop latestPosts as post}
	<li class="post-card">
		<etch:img mediaId="{post.image.id}" />
		<h3><a href="{post.permalink.relative}">{post.title}</a></h3>
		<p>{post.excerpt}</p>
	</li>
	{/loop}
</ul>
```

## Example 2: Conditional

**User**: "Featured" badge on posts in the featured category.

```html
{#if this.categories.pluck("slug").includes("featured")}
<span class="badge badge--featured">Featured</span>
{/if}
```

Uses `this.*` — swap to `item.*` inside a loop.

## Example 3: Copy a section between connected tabs

**User**: Copy Feature Section Frankfurt from Etch Patterns to etch.

Both tabs are Etch sites, so use the blocks copy/paste API, not a custom migration script. Look up current method names before scripting (`etch-copy-paste.md`).

1. Confirm copy/paste methods on a connected tab (Context7 or live probe on `etch.blocks`).
2. Find the block on the source tab (`Etch Patterns`) by name or class.
3. Call the copy method; save the returned payload to a temp file.
4. On the destination tab (`etch`), call the paste method with that payload; select the new block.
5. Only fix styles, components, loops, or media manually if paste fails or something breaks at runtime.
