from playhouse.shortcuts import model_to_dict

def bulk_convert_to_dict(modelList) -> dict:
    return list(
        map(
            model_to_dict,
            modelList
        ))
