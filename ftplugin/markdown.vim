if exists("g:loaded_mdlink")
  finish
endif
let g:loaded_mdlink = 1

command! -nargs=0 MarkdownUrlPaste call denops#notify("mdlink", "paste_markdown_url", [])
