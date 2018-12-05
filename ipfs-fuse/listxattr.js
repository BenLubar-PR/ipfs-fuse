const Fuse = require('fuse-bindings')
const explain = require('explain-error')
const debug = require('debug')('ipfs-fuse:listxattr')

module.exports = (ipfs) => {
  return {
    listxattr (path, buffer, length, reply) {
      debug({ path })

      ipfs.files.stat(path, (err, stat) => {
        if (err) {
          if (err.message === 'file does not exist') return reply(Fuse.ENOENT)
          err = explain(err, 'Failed to stat path')
          debug(err)
          return reply(Fuse.EREMOTEIO)
        }

        const allFields = 'user.ipfs-hash\0'

        if (!length) {
          reply(allFields.length)
        } else if (allFields.length > length) {
          reply(Fuse.ERANGE)
        } else {
          buffer.write(allFields)
          reply(allFields.length)
        }
      })
    }
  }
}
