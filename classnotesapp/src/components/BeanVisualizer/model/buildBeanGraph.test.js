import { describe, it, expect } from 'vitest';
import { buildBeanGraph } from './buildBeanGraph';

describe('buildBeanGraph — Java annotation mode', () => {
  it('builds a graph with a single @Component', () => {
    const { beans, wirings } = buildBeanGraph('@Component\npublic class A {}');
    expect(beans).toHaveLength(1);
    expect(beans[0].beanName).toBe('a');
    expect(wirings).toHaveLength(0);
  });

  it('builds a wiring for @Autowired field injection', () => {
    const code = `
@Component
public class A {
  @Autowired
  private B b;
}
@Component
public class B {}
    `;
    const { beans, wirings } = buildBeanGraph(code);
    expect(beans).toHaveLength(2);
    expect(wirings.some(w => w.from === 'a' && w.to === 'b')).toBe(true);
  });

  it('detects all Spring stereotypes', () => {
    const code = `
@Component
public class C {}
@Service
public class S {}
@Repository
public class R {}
@Controller
public class Ctrl {}
    `;
    const { beans } = buildBeanGraph(code);
    const types = beans.map(b => b.type);
    expect(types).toContain('component');
    expect(types).toContain('service');
    expect(types).toContain('repository');
    expect(types).toContain('controller');
  });

  it('strips [beansim]/[endbeansim] wrapper before parsing', () => {
    const code = '[beansim]\n@Component\npublic class A {}\n[endbeansim]';
    const { beans } = buildBeanGraph(code);
    expect(beans).toHaveLength(1);
    expect(beans[0].beanName).toBe('a');
  });

  it('returns empty beans and wirings for empty input', () => {
    const { beans, wirings } = buildBeanGraph('');
    expect(beans).toHaveLength(0);
    expect(wirings).toHaveLength(0);
  });

  it('produces a warnings object', () => {
    const { warnings } = buildBeanGraph('@Component\npublic class A {}');
    expect(warnings).toBeDefined();
    expect(typeof warnings).toBe('object');
  });

  it('produces no wiring when @Autowired refers to a non-existent class', () => {
    // Note: parseWirings internally tracks missingAutowiredTypes but those
    // warnings are not forwarded to the final warnings object by buildBeanGraph
    // (known gap — see SPEC-08). The observable effect is that no wiring is added.
    const code = `
@Component
public class A {
  @Autowired
  private NonExistent dep;
}
    `;
    const { wirings } = buildBeanGraph(code);
    expect(wirings).toHaveLength(0);
  });
});

describe('buildBeanGraph — XML mode', () => {
  it('detects XML mode when input contains <beans>', () => {
    const code = `
public class BeanA {}

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
  <bean id="beanA" class="BeanA"/>
</beans>
    `;
    const { beans } = buildBeanGraph(code);
    expect(beans.some(b => b.beanName === 'beanA')).toBe(true);
  });

  it('builds a wiring from <constructor-arg ref>', () => {
    const code = `
public class BeanA {}
public class BeanB {}

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
  <bean id="beanA" class="BeanA"/>
  <bean id="beanB" class="BeanB">
    <constructor-arg ref="beanA"/>
  </bean>
</beans>
    `;
    const { wirings } = buildBeanGraph(code);
    expect(wirings.some(w => w.from === 'beanB' && w.to === 'beanA')).toBe(true);
  });

  it('does not include beans whose class is not declared in the Java code', () => {
    const code = `
public class DeclaredClass {}

<beans xmlns="http://www.springframework.org/schema/beans">
  <bean id="declared" class="DeclaredClass"/>
  <bean id="ghost" class="Undeclared"/>
</beans>
    `;
    const { beans } = buildBeanGraph(code);
    expect(beans.some(b => b.beanName === 'ghost')).toBe(false);
    expect(beans.some(b => b.beanName === 'declared')).toBe(true);
  });
});

describe('buildBeanGraph — cycle detection integration', () => {
  it('does not crash on circular dependencies', () => {
    const code = `
@Component
public class A {
  @Autowired
  private B b;
}
@Component
public class B {
  @Autowired
  private A a;
}
    `;
    expect(() => buildBeanGraph(code)).not.toThrow();
  });
});
