#! /bin/bash
hcdev package --output app.hcpkg --strip-meta && cargo test -- --nocapture
