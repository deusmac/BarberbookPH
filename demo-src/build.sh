#!/bin/sh
# Assemble the single-file demo from demo-src parts (clay theme css is inserted before the head's closing </style>).
cd "$(dirname "$0")" && {
  awk 'FNR==NR{c=c $0 "\n"; next} /^<\/style>/ && !d {printf "%s", c; d=1} {print}' 1b-clay.css 1-head.html
  cat 2-core.js 2b-glue.js 3-customer.js 4-owner.js 5-shell.js
  printf '\n</script>\n</body>\n</html>\n'
} > ../barberbook-demo.html && echo built
