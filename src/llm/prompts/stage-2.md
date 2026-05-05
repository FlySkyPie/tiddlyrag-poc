/no_think {% include 'segments/simple_chat_system_prompt.md' %}

<START_OF_CONTEXT>
{% for item in files %}
## File Path: {{ item.path }}

{{ item.content }}
{% endfor %}
<END_OF_CONTEXT>

<query>
{% include 'segments/technical_wiki_generator_prompt.md' %} 
</query>

Assistant: 