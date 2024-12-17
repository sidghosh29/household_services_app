class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///secure_db.sqlite3"
    DEBUG = True
    SECRET_KEY = "You wil never know" #This is not a salt. It is a key for signing the session data.
    '''
    Flask security uses the secret key to generate a cryptographic signature for the session data.
    A session is a “container” that holds user data on the server, usually identified by a session ID 
    stored in a client-side cookie. Each time a user makes a request, the session ID is sent to the server, 
    allowing it to retrieve that user’s session data. 
    
    In Flask, after login, a session cookie is created and stored in the client’s browser. 
    This cookie typically includes a signed token rather than a hash of the user's data. 
    Here’s how it works:
    Session Cookie Creation: Flask uses the SECRET_KEY to sign the session data, creating a secure token 
    that stores limited information, such as the session ID or user identifier.
    Verification on Each Request: When a user makes subsequent requests, the server uses the SECRET_KEY to 
    verify the signature of the session token in the cookie. This verification step ensures the cookie hasn’t 
    been tampered with. The server checks the signature’s integrity, confirming 
    the session's validity without exposing sensitive information.
    If the signature is valid, the server retrieves the session data associated with that user.

    '''
    SECURITY_PASSWORD_HASH = "bcrypt" 
    '''
    Bcrypt is a popular hashing algorithm used to securely hash passwords. 
    Bcrypt is widely used in web development for password hashing because 
    of its ability to automatically handle salt generation and its resistance 
    to rainbow table attacks.

    When a password is hashed with bcrypt, the algorithm first generates a salt 
    and combines it with the password. It then hashes the combined data using the Blowfish cipher, 
    applying the specified number of iterations (determined by the cost factor). The resulting hash 
    is stored in a specific format that includes the version, cost factor, salt, and hash.
    '''
    SECURITY_PASSWORD_SALT = "you will never know the salt"
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"

    #cache specific
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 60
    CACHE_REDIS_PORT = 6379