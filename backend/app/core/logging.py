import logging
import sys

def setup_logging(level: str = "INFO") -> None:
    """
    Configures centralized structured logging for the DineGo backend.
    """
    log_format = "%(asctime)s | %(levelname)-7s | %(name)s | %(message)s"
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format=log_format,
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )
    # Ensure our application loggers are set properly
    logging.getLogger("dinego").setLevel(getattr(logging, level.upper(), logging.INFO))
