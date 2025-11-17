from fastapi import Response, status

NotFound = Response(status_code=status.HTTP_404_NOT_FOUND)
