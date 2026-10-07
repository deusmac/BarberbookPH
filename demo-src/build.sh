#!/bin/sh
# Assemble the single-file demo from demo-src parts.
cd "$(dirname "$0")" && { cat 1-head.html 2-core.js 2b-glue.js 3-customer.js 4-owner.js 5-shell.js; printf '\n</script>\n</body>\n</html>\n'; } > ../barberbook-demo.html && echo built
