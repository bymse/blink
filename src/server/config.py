import configparser
import os
import sys


class Config:
    parser: configparser.ConfigParser
    _rsa_private_key: str | None = None
    _rsa_public_key: str | None = None

    def __init__(self):
        self.parser = configparser.ConfigParser()
        config_path = os.environ.get('CONFIG_PATH')
        self.parser.read(config_path)

    @property
    def redis_url(self) -> str:
        return self._get('database', 'redis_url')

    @property
    def connection_ttl_seconds(self) -> int:
        return int(self._get('connection', 'ttl_seconds'))

    @property
    def rsa_private_key(self) -> str:
        if self._rsa_private_key is not None:
            return self._rsa_private_key
        self._rsa_private_key = self._get_from_file('rsa', 'private_key_path')
        return self._rsa_private_key

    @property
    def rsa_public_key(self) -> str:
        if self._rsa_public_key is not None:
            return self._rsa_private_key
        self._rsa_public_key = self._get_from_file('rsa', 'public_key_path')
        return self._rsa_public_key

    def _get(self, section: str, key: str) -> str:
        if self.parser.has_option(section, key):
            return self.parser.get(section, key)
        else:
            return os.environ.get(f'{section}_{key}')

    def _get_from_file(self, section: str, path_key: str) -> str:
        path = self._get(section, path_key)
        with open(path, 'r') as f:
            return f.read()


config = Config()
