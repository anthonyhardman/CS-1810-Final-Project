#version 300 es

precision mediump float;

out vec4 fragColor;

uniform bool lit;

in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoord;

uniform sampler2D texture1;

void main()
{
    vec3 color = texture(texture1, TexCoord).rgb;
    vec3 lightPos = vec3(-0.0f, 0.0f, 5.0f);
    vec3 viewPos = vec3(0.0f, 0.0f, 1.0f);

    if (lit)
    {
        vec3 ambient = 0.1f * color;
        vec3 lightDir = normalize(lightPos - FragPos);
        vec3 normal = normalize(Normal);
        float diff = max(dot(lightDir, normal), 0.0f);
        vec3 diffuse = diff * color;
        vec3 viewDir = normalize(viewPos - FragPos);
        float spec = 0.0f;
        vec3 halfwayDir = normalize(lightDir + viewDir);  
        spec = pow(max(dot(normal, halfwayDir), 0.0f), 32.0f);
        vec3 specular = vec3(0.3f) * spec; 
        fragColor = vec4(ambient + diffuse + specular, 1.0f);
    }
    else
    {
        fragColor = vec4(color, 1.0f);
    }
}