from asyncio import gather
from fastapi import APIRouter, Path
from converter import async_converter
from schemas import ConverterInput, ConverterOutput

router = APIRouter(prefix='/converter')

@router.get('/async/v2/{from_currency}',response_model=ConverterOutput)
async def converter(
    body: ConverterInput,
    from_currency: str = Path(max_length=50, regex='^[A-Z]{3}$'),
):    
    coroutines = []
    
    to_currencies = body.to_currencies
    price = body.price

    for currency in to_currencies:
        response = async_converter(
            from_currency=from_currency,
            to_currency=currency,
            price=price
        )
        coroutines.append(response)

    result = await gather(*coroutines)
    
    return ConverterOutput(
        message='Successfully converted',
        converted_prices=result
    )