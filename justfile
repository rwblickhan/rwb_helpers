dev:
    pnpm run dev

dev-firefox:
    pnpm run dev:firefox

build:
    pnpm run build

build-firefox:
    pnpm run build:firefox

zip:
    pnpm run zip

zip-firefox:
    pnpm run zip:firefox

check:
    pnpm run compile

install:
    pnpm install

prepare:
    pnpm run postinstall

clean:
    rm -rf node_modules pnpm-lock.yaml
    pnpm install

package: build zip

package-firefox: build-firefox zip-firefox

alias d := dev
alias df := dev-firefox
alias b := build
alias bf := build-firefox
alias z := zip
alias zf := zip-firefox
alias c := check
alias i := install
alias p := package
alias pf := package-firefox
