import configparser
import os
import sys


class Config:
    parser: configparser.ConfigParser

    def __init__(self):
        parser = configparser.ConfigParser()
        if len(sys.argv) >= 2:
            config_path = sys.argv[1]
            parser.read(config_path)

    @property
    def redis_url(self) -> str:
        return self._get('database', 'redis_url')

    def _get(self, section: str, key: str) -> str:
        return self.parser.get(section, key) or os.environ.get(f'{section}_{key}')


config = Config()
