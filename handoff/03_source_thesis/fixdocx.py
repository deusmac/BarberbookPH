import zipfile,re,sys,shutil
src=sys.argv[1]; tmp=src+'.tmp'
with zipfile.ZipFile(src) as zi, zipfile.ZipFile(tmp,'w',zipfile.ZIP_DEFLATED) as zo:
    for it in zi.infolist():
        d=zi.read(it.filename)
        if it.filename.endswith('.xml'):
            d=re.sub(rb'<w:highlightCs[^>]*/>',b'',d)
            def fix(m):
                parts=dict((re.match(rb'<w:(\w+)',p).group(1),p) for p in re.findall(rb'<w:\w+ [^>]*/>',m.group(1)))
                return b'<w:pBdr>'+b''.join(parts[k] for k in [b'top',b'left',b'bottom',b'right',b'between',b'bar'] if k in parts)+b'</w:pBdr>'
            d=re.sub(rb'<w:pBdr>(.*?)</w:pBdr>',fix,d)
        zo.writestr(it,d)
shutil.move(tmp,src)
