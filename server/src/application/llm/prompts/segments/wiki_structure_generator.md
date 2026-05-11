Analyze this Git repository ({{repo_url}}) and create a wiki structure for it.

1. The complete file tree of the project:
<file_tree>
{% for item in files -%}
{{ item.path }}
{% endfor -%}
</file_tree>

2. The README file of the project:
<readme>
{{readme}}
</readme>

I want to create a wiki for this repository. Determine the most logical structure for a wiki based on the repository's content.

IMPORTANT: The wiki content will be generated in {{language}} language.

When designing the wiki structure, include articles that would benefit from visual diagrams, such as:
- Architecture overviews
- Data flow descriptions
- Component relationships
- Process workflows
- State machines
- Class hierarchies

{% if is_comprehensive_view %}
Create a structured wiki with the following main selects (representing UI categories):
- Overview (general information about the project)
- System Architecture (how the system is designed)
- Core Features (key functionality)
- Data Management/Flow: If applicable, how data is stored, processed, accessed, and managed (e.g., database schema, data pipelines, state management).
- Frontend Components (UI elements, if applicable.)
- Backend Systems (server-side components)
- Model Integration (AI model connections)
- Deployment/Infrastructure (how to deploy, what's the infrastructure like)
- Extensibility and Customization: If the project architecture supports it, explain how to extend or customize its functionality (e.g., plugins, theming, custom modules, hooks).

Each select should contain relevant articles. For example, the "Frontend Components" select might include articles for "Home Page", "Repository Wiki Page", "Ask Component", etc.

Return your analysis in the following XML format:

<wiki_structure>
  <title>[Overall title for the wiki]</title>
  <description>[Brief description of the repository]</description>
  <selects>
    <select id="select-1">
      <title>[Select title]</title>
      <articles>
        <article_ref>article-1</article_ref>
        <article_ref>article-2</article_ref>
      </articles>
      <subselects>
        <select_ref>select-2</select_ref>
      </subselects>
    </select>
    <!-- More selects as needed -->
  </selects>
  <articles>
    <article id="article-1">
      <title>[Article title]</title>
      <description>[Brief description of what this article will cover]</description>
      <importance>high|medium|low</importance>
      <relevant_files>
        <file_path>[Path to a relevant file]</file_path>
        <!-- More file paths as needed -->
      </relevant_files>
      <related_articles>
        <related>article-2</related>
        <!-- More related article IDs as needed -->
      </related_articles>
      <parent_select>select-1</parent_select>
    </article>
    <!-- More articles as needed -->
  </articles>
</wiki_structure>
{% else %}
Return your analysis in the following XML format:

<wiki_structure>
  <title>[Overall title for the wiki]</title>
  <description>[Brief description of the repository]</description>
  <articles>
    <article id="article-1">
      <title>[Article title]</title>
      <description>[Brief description of what this article will cover]</description>
      <importance>high|medium|low</importance>
      <relevant_files>
        <file_path>[Path to a relevant file]</file_path>
        <!-- More file paths as needed -->
      </relevant_files>
      <related_articles>
        <related>article-2</related>
        <!-- More related article IDs as needed -->
      </related_articles>
    </article>
    <!-- More articles as needed -->
  </articles>
</wiki_structure>
{% endif %}

IMPORTANT FORMATTING INSTRUCTIONS:
- Return ONLY the valid XML structure specified above
- DO NOT wrap the XML in markdown code blocks (no ``` or ```xml)
- DO NOT include any explanation text before or after the XML
- Ensure the XML is properly formatted and valid
- Start directly with <wiki_structure> and end with </wiki_structure>

IMPORTANT:
1. Create {{ '8-12' if is_comprehensive_view else '4-6' }} articles that would make a 
 {{ 'comprehensive' if is_comprehensive_view else 'concise' }} wiki for this repository
2. Each article should focus on a specific aspect of the codebase (e.g., architecture, key features, setup)
3. The relevant_files should be actual files from the repository that would be used to generate that article
4. Return ONLY valid XML with the structure specified above, with no markdown code block delimiters