const Fuse = require('fuse-bindings')
const explain = require('explain-error')
const debug = require('debug')('ipfs-fuse:getxattr')

module.exports = (ipfs) => {
  return {
    getxattr (path, name, buffer, length, offset, reply) {
      debug({ path })

      ipfs.files.stat(path, (err, stat) => {
        if (err) {
          if (err.message === 'file does not exist') return reply(Fuse.ENOENT)
          err = explain(err, 'Failed to stat path')
          debug(err)
          return reply(Fuse.EREMOTEIO)
        }

        if (name !== 'user.ipfs-hash') {
          return reply(Fuse.ENODATA)
        }

        if (!length) {
          reply(stat.hash.length)
        } else if (offset < 0 || offset + stat.hash.length > length) {
          reply(Fuse.ERANGE)
        } else {
          buffer.write(stat.hash, offset)
          reply(stat.hash.length)
        }
      })
    }
  }
}
