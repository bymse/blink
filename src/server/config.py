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

    @property
    def connection_ttl_seconds(self) -> int:
        return int(self._get('connection', 'ttl_seconds'))

    @property
    def rsa_private_key(self) -> str:
        return self._get('rsa', 'private_key')

    @property
    def rsa_public_key(self) -> str:
        return self._get('rsa', 'public_key')

    def _get(self, section: str, key: str) -> str:
        return self.parser.get(section, key) or os.environ.get(f'{section}_{key}')


config = Config()
