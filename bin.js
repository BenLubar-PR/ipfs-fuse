#!/usr/bin/env node

const IpfsFuse = require('./')

const mountPath = '/storage/ipfs/fuse'

IpfsFuse.mount(mountPath, {
  ipfs: {},
  fuse: { displayFolder: true, force: true, options: ['allow_other'] }
}, (err) => {
  if (err) return console.error(err.message)
  console.log(`Mounted IPFS filesystem on ${mountPath}`)
})

let destroyed = false

process.on('SIGINT', () => {
  if (destroyed) return

  destroyed = true

  IpfsFuse.unmount(mountPath, (err) => {
    if (err) return console.error(err.message)
    console.log(`Unmounted IPFS filesystem at ${mountPath}`)
  })
})
