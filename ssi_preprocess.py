#!/usr/bin/env python
'''
This script copies the files in one directory to another, expanding any SSI
<!-- #include --> statements it encounters along the way.
Usage:
  ./ssi_expander.py [source_directory] destination_directory
If source_directory is not specified, then the current directory is used.
'''

import re
import os
import sys
import os.path
import warnings

error_tmpl = """
<p style="background-color: #660000; color: white; padding: 20px">
  %s
</p>
"""

def InlineIncludes(path, web_path):
  """Read a file, expanding <!-- #include --> statements."""
  def get_include_file_content(x):
    file_to_read =  x.group(2)
    recursive_web_path = web_path
    if  len(os.path.dirname(web_path)) >2:
       file_to_read = os.path.join(os.path.dirname(web_path),file_to_read)[1:]
       recursive_web_path = "/%s/" % os.path.dirname(file_to_read)
    if os.path.exists(file_to_read):
      # Recursively process ssi calls in the included file
      return InlineIncludes(file_to_read, recursive_web_path)
    else:
      error = "File not found: %s from %s:%s" % (file_to_read, path, web_path)
      warnings.warn(error)
      return error_tmpl % error

  content = open(path).read()
  content = re.sub(r'<!-- *#include *(virtual|file)=[\'"]([^\'"]+)[\'"] *-->',
      get_include_file_content,
      content)
  return content

def process(source, dest):
  for dirpath, dirnames, filenames in os.walk(source):
    dest_dir = os.path.realpath(os.path.join(dest, os.path.relpath(dirpath, source)))
    for filename in filenames:
      src_path = os.path.abspath(os.path.join(dirpath, filename))
      dest_path = os.path.join(dest_dir, filename)
      if filename.endswith('.html'):
        file(dest_path, 'w').write(InlineIncludes(src_path, "/%s" % os.path.relpath(src_path)))

    # ignore hidden directories
    for dirname in dirnames[:]:
      if dirname.startswith('.'):
        dirnames.remove(dirname)


if __name__ == '__main__':
  if len(sys.argv) == 2:
    source = '.'
    dest = sys.argv[1]
  elif len(sys.argv) == 3:
    source, dest = sys.argv[1:]
  else:
    file("index.html", 'w').write(InlineIncludes(os.path.abspath("index.html.template"), "/index.html.template"))
    sys.exit(1)

  process(source, dest)
