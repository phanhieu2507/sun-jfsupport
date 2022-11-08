<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobfairRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'string|required|unique:jobfairs',
            'start_date' => 'required|date',
            'number_of_students' => 'required|numeric|gte:1',
            'number_of_companies' => 'required|numeric|gte:1',
            'channel_type' => 'required|numeric',
            'channel' => 'required',
            'admin_ids' => 'required|array|min:1',
        ];
    }

    public function messages()
    {
        return [
            'name.unique' => 'この名前はすでに存在します',
        ];
    }
}
