from transformers import AutoTokenizer, AutoModelForCausalLM
tokenizer = AutoTokenizer.from_pretrained("nsql-llama-2-7B/")
model = AutoModelForCausalLM.from_pretrained("nsql-llama-2-7B/")

def getQuery(ddl_text, prompt_text):
    context = "-- Using valid SQLite, answer the following questions for the tables provided above."
    text = ddl_text + "\n"+ context + "\n-- " + prompt_text + "\nSELECT"

    input_ids = tokenizer(text, return_tensors="pt").input_ids
    generated_ids = model.generate(input_ids, max_length=1500)

    length_of_extras = len(text) - len ("SELECT")

    return tokenizer.decode(generated_ids[0], skip_special_tokens=True)[length_of_extras:]