# -*- coding: utf-8 -*-

"""Console script."""
import logging
import typer
from pathlib import Path
from typing import Optional
from rich.logging import RichHandler
from sys import version_info
from wgscovplot.wgscovplot import run
from wgscovplot import __version__

app = typer.Typer()


def version_callback(value: bool):
    if value:
        typer.echo(f"wgscovplot version {__version__}")
        raise typer.Exit()


def check_dir_exists_callback(path: Path) -> Path:
    if not (path.exists() or path.is_dir()):
        raise typer.BadParameter(f'An existing Nextflow workflow results directory must be specified! '
                                 f'"{path}" does not exist or is not a directory!')
    return path


@app.command(
    epilog=f"wgscovplot version {__version__}; Python {version_info.major}.{version_info.minor}.{version_info.micro}"
)
def main(
        input_dir: Path = typer.Argument(..., callback=check_dir_exists_callback, help="Nextflow workflow results "
                                                                                       "directory"),
        output_html: Path = typer.Option("wgscovplot.html", help="Output File of Interactive HTML Coverage Plot"),
        primer_seq_path: Path = typer.Option(None, help="Path to primer sequences (Fasta)"),
        low_coverage_threshold: int = typer.Option(default=10, help="Low Coverage Threshold"),
        amplicon: bool = typer.Option(default=True, help="Plot Amplicon Coverage Depth"),
        gene_feature: bool = typer.Option(default=True, help="Plot Gene Features"),
        segment_virus: bool = typer.Option(default=False, help="Generate Coverage plot for segments virus"),
        dev: bool = typer.Option(default=False, help="Run tool with debug mode"),
        edit_distance: int = typer.Option(default=0, help="Maximum k errors allowed for primer sequence alignment ("
                                                          "use this option when --primer-seq provided"),
        verbose: bool = typer.Option(default=False, help="Verbose logs"),
        version: Optional[bool] = typer.Option(None,
                                               callback=version_callback,
                                               help=f'Print {"wgscovplot version"} and exit')
):
    from rich.traceback import install

    install(show_locals=True)

    logging.basicConfig(
        format="%(message)s",
        datefmt="[%Y-%m-%d %X]",
        level=logging.INFO if not verbose else logging.DEBUG,
        handlers=[RichHandler(rich_tracebacks=True, tracebacks_show_locals=True)],
    )
    run(input_dir, low_coverage_threshold, amplicon, gene_feature, segment_virus, primer_seq_path, edit_distance, dev,
        output_html)


if __name__ == "__main__":
    app()
