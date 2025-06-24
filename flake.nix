{
  description = "fsinf web";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      with pkgs;
      {
        # enables use of `nix shell`
        devShells.default = mkShell {
          # add things you want in your shell here
          buildInputs = [
            nodejs_24
          ];
        };
      }
    );
}
